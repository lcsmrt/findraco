import type { Category } from "@/api/dtos";
import {
  CreateTransactionSeriesRequest,
  Transaction,
  ParticipantInput,
  ParticipantShare,
  RecurrenceDefinitionResponse,
  RepaymentAllocationInput,
  SeriesEditScope,
  SplitMode,
  UpdateTransactionRequest,
  UpdateTransactionSeriesRequest,
} from "@/api/dtos/transaction";
import type { Contact } from "@/api/dtos/contact";
import type { PlanMember } from "@/api/dtos/plan";
import type { AddTransactionPreset } from "@/app/providers/useAddTransaction";
import { toCents } from "@/utils/money";
import { addMonths, differenceInCalendarMonths, isSameDay } from "date-fns";
import { toIsoDate } from "@/utils/dates";
import { z } from "zod";
import { hidesItems, isNeutralKind } from "../utils/movementKind";
import type { InlineSaveBody } from "./transactionColumns";

export type TransactionFormMode = "create" | "edit" | "duplicate";

// Narrows the required money fields to `number`, so a valid submit hands `toPayload` no `null`.
function isPositiveAmount(value: number | null): value is number {
  return value !== null && value > 0;
}

/**
 * Cents of a money field for sums and comparisons. A field that failed its own rule still reaches
 * the cross-field checks below as `null`, and counts as nothing, as an empty field always has.
 */
function centsOf(value: number | null | undefined): number {
  return value == null ? 0 : toCents(value);
}

type RepaymentCheckValues = {
  amount: number | null;
  repaymentContact?: { id: number } | null;
  allocations?: { checked: boolean; open: number; amount: number | null }[];
};

/** What a contact payment must hold to be saved: its contact, and ticked amounts that fit. */
function addRepaymentIssues(values: RepaymentCheckValues, ctx: z.RefinementCtx) {
  if (!values.repaymentContact) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "transactions.form.choosePayingContact",
      path: ["repaymentContact"],
    });
  }

  const ticked = (values.allocations ?? []).flatMap((row, index) => (row.checked ? [{ row, index }] : []));
  for (const { row, index } of ticked) {
    const cents = centsOf(row.amount);
    if (cents <= 0 || cents > toCents(row.open)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: cents <= 0 ? "transactions.form.allocationNeedsAmount" : "transactions.form.allocationAboveOpen",
        path: ["allocations", index, "amount"],
      });
    }
  }

  const tickedCents = ticked.reduce((sum, { row }) => sum + centsOf(row.amount), 0);
  if (tickedCents > centsOf(values.amount)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "transactions.form.allocationsAboveAmount",
      path: ["allocations"],
    });
  }
}

export const transactionFormSchema = z
  .object({
    type: z.enum(["DEBIT", "CREDIT"]),
    /** Empty for a normal income or expense. */
    kind: z.enum(["TRANSFER", "CARD_BILL_PAYMENT", "SAVINGS", "REFUND", "REPAYMENT"]).nullish(),
    description: z.string().min(1, "transactions.form.descriptionIsRequired"),
    amount: z.number().nullable().refine(isPositiveAmount, "transactions.form.amountMustBePositive"),
    category: z
      .object({
        id: z.number(),
        version: z.number(),
        type: z.enum(["DEBIT", "CREDIT"]),
        description: z.string(),
        spendingLimit: z.number().nullish(),
      })
      .nullable()
      .optional(),
    date: z.date({ required_error: "transactions.form.dateIsRequired" }),
    recurring: z.boolean(),
    seriesEdit: z.boolean(),
    /** A series' flag: its occurrences stay forecast until confirmed. Only series forms send it. */
    requiresConfirmation: z.boolean(),
    /** The Status control of an occurrence that requires confirmation: true is Actual. */
    confirmed: z.boolean(),
    recurrenceMode: z.enum(["INSTALLMENT", "RECURRING"]).optional(),
    /** Whole count; `null` or unset when empty. */
    parcelsNumber: z.number().nullable().optional(),
    /** Whole count; empty means the first installment. */
    currentParcel: z.number().nullable().optional(),
    endDate: z.date().optional(),
    /**
     * What a series edit opened with. The date and the installment count may change, and the
     * schema compares them with the opened values. Unset outside a series edit.
     */
    original: z
      .object({ date: z.date(), parcelsNumber: z.number().nullable() })
      .optional(),
    attributionMode: z.enum(["ME", "SOMEONE", "SPLIT"]),
    splitMode: z.enum(["EQUAL", "EXACT"]),
    /** A person of the split: a member (`memberId`) or a contact (`contactId`); `memberName` is the name shown. */
    participants: z.array(
      z.object({
        memberId: z.number().optional(),
        contactId: z.number().optional(),
        memberName: z.string(),
        shareAmount: z.number().nullable(),
      }),
    ),
    /** The contact a contact payment came from. */
    repaymentContact: z.object({ id: z.number(), name: z.string() }).nullish(),
    /** The purchases of that contact the payment may settle, ticked or not. */
    allocations: z
      .array(
        z.object({
          participantId: z.number(),
          date: z.string(),
          description: z.string(),
          open: z.number(),
          checked: z.boolean(),
          amount: z.number().nullable(),
        }),
      )
      .optional(),
    items: z.array(
      z.object({
        description: z.string().min(1, "transactions.form.descriptionIsRequired"),
        amount: z.number().nullable().refine(isPositiveAmount, "transactions.form.amountMustBePositive"),
        category: z
          .object({
            id: z.number(),
            version: z.number(),
            type: z.enum(["DEBIT", "CREDIT"]),
            description: z.string(),
            spendingLimit: z.number().nullish(),
          })
          .nullable()
          .optional(),
      }),
    ),
  })
  .superRefine((values, ctx) => {
    if (values.items.length > 0) {
      const itemsCents = values.items.reduce((sum, item) => sum + centsOf(item.amount), 0);

      if (itemsCents > centsOf(values.amount)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "transactions.form.itemsCannotExceedTheTransaction",
          path: ["items"],
        });
      }
    }

    if (values.kind === "REFUND" && !values.category) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "transactions.form.refundNeedsACategory",
        path: ["category"],
      });
    }

    // A neutral movement hides the attribution, so a choice left behind there must not block saving.
    const attributed = !isNeutralKind(values.kind);

    if (values.kind === "REPAYMENT") {
      addRepaymentIssues(values, ctx);
    }

    if (
      attributed &&
      values.attributionMode === "SPLIT" &&
      values.participants.some((participant) => participant.contactId !== undefined) &&
      (values.type === "CREDIT" || values.kind)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "transactions.form.contactsOnExpensesOnly",
        path: ["participants"],
      });
    }

    if (attributed && values.attributionMode === "SOMEONE" && values.participants.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "transactions.form.choosePerson",
        path: ["participants"],
      });
    }

    if (
      attributed &&
      values.attributionMode === "SPLIT" &&
      values.splitMode === "EXACT" &&
      values.participants.length > 0
    ) {
      const sumCents = values.participants.reduce(
        (sum, participant) => sum + centsOf(participant.shareAmount),
        0,
      );

      if (sumCents !== centsOf(values.amount)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "transactions.form.sharesMustAddUpTo",
          path: ["participants"],
        });
      }
    }

    if (values.seriesEdit) {
      if (values.recurrenceMode === "INSTALLMENT") {
        if ((values.parcelsNumber ?? 0) < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "transactions.form.enterAtLeast2Installments",
            path: ["parcelsNumber"],
          });
        }
        // A new count rebuilds the whole series and a new date moves part of it: one edit cannot do both.
        if (
          values.original &&
          !isSameDay(values.date, values.original.date) &&
          (values.parcelsNumber ?? null) !== values.original.parcelsNumber
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "transactions.form.dateAndInstallmentsInSeparateEdits",
            path: ["parcelsNumber"],
          });
        }
      }
      // The end date is checked against the earlier of the opened and the new date: moving the last
      // occurrence past the series' end date is allowed, the series' end moves with it. An occurrence
      // moved alone past the end reopens with its moved date, which says nothing about the end, so
      // the check only runs when the date changed in this edit.
      const dateChanged = !values.original || !isSameDay(values.date, values.original.date);
      const earliestDate =
        values.original && values.original.date < values.date ? values.original.date : values.date;
      if (
        dateChanged &&
        values.recurrenceMode === "RECURRING" &&
        values.endDate &&
        values.endDate < earliestDate
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "transactions.form.theEndDateMustBe",
          path: ["endDate"],
        });
      }
      return;
    }

    if (!values.recurring) return;

    if (!values.recurrenceMode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "transactions.form.selectInstallmentOrRecurring",
        path: ["recurrenceMode"],
      });
      return;
    }

    if (values.recurrenceMode === "INSTALLMENT") {
      const total = values.parcelsNumber ?? 0;
      if (total < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "transactions.form.enterAtLeast2Installments",
          path: ["parcelsNumber"],
        });
      }

      const current = values.currentParcel;
      if (current != null) {
        if (current < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "transactions.form.theCurrentInstallmentMustBe",
            path: ["currentParcel"],
          });
        } else if (total >= 2 && current > total) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "transactions.form.theCurrentInstallmentCannotBe",
            path: ["currentParcel"],
          });
        }
      }
    }

    if (values.recurrenceMode === "RECURRING") {
      if (values.endDate && values.endDate < values.date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "transactions.form.theEndDateMustBe",
          path: ["endDate"],
        });
      }
    }
  });

/** What the fields hold while editing: money in reais, `null` when empty. */
export type TransactionFormValues = z.input<typeof transactionFormSchema>;

/** What a valid submit hands over: the amount and item amounts are no longer `null`. */
export type TransactionFormOutput = z.output<typeof transactionFormSchema>;

function deriveAttributionMode(
  participants: Transaction["participants"],
  currentUserId?: number,
): TransactionFormValues["attributionMode"] {
  if (participants.length === 0) return "ME";
  // A contact is only ever one of a split: the single-person picker lists members.
  if (participants.some((participant) => participant.contactId != null)) return "SPLIT";
  if (participants.length === 1) {
    return participants[0].id === currentUserId ? "ME" : "SOMEONE";
  }
  return "SPLIT";
}

type OwnerDefaultInput = {
  category: Pick<Category, "ownerId"> | null | undefined;
  members: PlanMember[];
  currentUserId?: number;
  /** True once the user changed the attribution or participants by hand. */
  participantsTouched: boolean;
};

/**
 * The attribution an owned category implies: its owner as the single
 * 100% participant. Null when the participants were edited by hand, the
 * category is not owned, or the owner is no longer a member of the plan.
 */
export function ownerDefaultAttribution({
  category,
  members,
  currentUserId,
  participantsTouched,
}: OwnerDefaultInput): Pick<
  TransactionFormValues,
  "attributionMode" | "splitMode" | "participants"
> | null {
  if (participantsTouched) return null;
  const owner = members.find((member) => member.userId === category?.ownerId);
  if (!owner) return null;
  if (owner.userId === currentUserId) {
    return { attributionMode: "ME", splitMode: "EQUAL", participants: [] };
  }
  return {
    attributionMode: "SOMEONE",
    splitMode: "EQUAL",
    participants: [
      { memberId: owner.userId, memberName: owner.name, shareAmount: null },
    ],
  };
}

type AttributionValues = Pick<
  TransactionFormValues,
  "attributionMode" | "splitMode" | "participants"
>;

/**
 * The participants a newly selected category sets: its active
 * owner at 100%, otherwise the form's default participants (`defaults`, from
 * `buildDefaultValues`). Null — leave them as they are — in edit mode or once
 * the participants were edited by hand.
 */
export function categoryAttribution({
  mode,
  defaults,
  ...input
}: OwnerDefaultInput & {
  mode: TransactionFormMode;
  defaults: AttributionValues;
}): AttributionValues | null {
  if (mode === "edit" || input.participantsTouched) return null;
  return ownerDefaultAttribution(input) ?? defaults;
}

/**
 * What is left of the total once the items are taken out, in cents; negative when the items exceed
 * it. Empty amounts count as nothing, as in the "items cannot exceed the total" rule.
 */
export function itemsRemainderCents(
  amount: number | null | undefined,
  items: { amount: number | null | undefined }[],
): number {
  return items.reduce((remainder, item) => remainder - centsOf(item.amount), centsOf(amount));
}

/**
 * The last installment of a series being created: its number and month, counted from the date of
 * the current installment (1 when empty). Null until the count and current installment make sense.
 */
export function lastInstallment(
  date: Date,
  parcelsNumber: number | null | undefined,
  currentParcel: number | null | undefined,
): { number: number; month: Date } | null {
  const current = currentParcel ?? 1;
  if (parcelsNumber == null || parcelsNumber < 2 || current < 1 || current > parcelsNumber) {
    return null;
  }
  return { number: parcelsNumber, month: addMonths(date, parcelsNumber - current) };
}

/**
 * Whether a series edit changed an installment series' number of installments. That change rebuilds
 * the whole series, so it applies to every occurrence without asking for a scope.
 */
export function seriesParcelsChanged(
  definition: RecurrenceDefinitionResponse | undefined,
  parcelsNumber: number | null | undefined,
): boolean {
  return definition?.mode === "INSTALLMENT" && parcelsNumber !== (definition.parcelsNumber ?? null);
}

/** Whether a series edit moved the occurrence to another day than the one it was opened on. */
export function seriesDateChanged(transaction: Pick<Transaction, "startDate">, date: Date): boolean {
  return !isSameDay(date, parseLocalDate(transaction.startDate));
}

/**
 * The installment number of one occurrence of a series. The definition keeps only the first
 * generated parcel and its month, one parcel a month after it, as the backend generates them.
 */
export function occurrenceParcel(
  definition: Pick<RecurrenceDefinitionResponse, "startDate" | "firstParcel">,
  occurrenceDate: string,
): number {
  const months = differenceInCalendarMonths(
    parseLocalDate(occurrenceDate),
    parseLocalDate(definition.startDate),
  );
  return (definition.firstParcel ?? 1) + months;
}

/**
 * The participants a new attribution mode starts with: none for "me", one other member for
 * "someone else" (the one already chosen, else the first member besides the current user), and every
 * member for a split unless at least two are already chosen.
 */
export function participantsForMode(
  mode: TransactionFormValues["attributionMode"],
  participants: TransactionFormValues["participants"],
  members: PlanMember[],
  currentUserId?: number,
): TransactionFormValues["participants"] {
  if (mode === "ME") return [];
  if (mode === "SOMEONE") {
    // A contact is never "someone else": that picker lists members only.
    const chosen = participants.find(
      (participant) => participant.memberId !== undefined && participant.memberId !== currentUserId,
    );
    if (chosen) return [chosen];
    const first = members.find((member) => member.userId !== currentUserId);
    return first
      ? [{ memberId: first.userId, memberName: first.name, shareAmount: null }]
      : [];
  }
  if (participants.length >= 2) return participants;
  return members.map((member) => ({
    memberId: member.userId,
    memberName: member.name,
    shareAmount: null,
  }));
}

type AttributionVisibilityInput = {
  canAttributeToOthers: boolean;
  members: PlanMember[];
  /** Whether the plan has an active contact to split with, which a plan of one member has use for. */
  hasContacts?: boolean;
  /** Who the edited row is already split with; empty when creating. */
  participants: Transaction["participants"];
  currentUserId?: number;
};

/**
 * Whether the form shows the attribution fields. A plan with one member left hides them, unless it has a
 * contact to split with or the row already has someone else on it: saving a form whose participants were
 * never shown would drop them.
 */
export function showsAttribution({
  canAttributeToOthers,
  members,
  hasContacts = false,
  participants,
  currentUserId,
}: AttributionVisibilityInput): boolean {
  return (
    canAttributeToOthers &&
    (members.length > 1 ||
      hasContacts ||
      participants.some((participant) => participant.id !== currentUserId))
  );
}

/** One line of the participants list: a person the split can include. */
export type SplitRow = { userId: number; name: string; isFormer: boolean };

/**
 * Who the split lists: the plan's members, then whoever is already on the row without being a member any
 * more, so their share can be seen, changed or removed. A former member never appears on a row that does
 * not carry them.
 */
export function splitRows(
  members: PlanMember[],
  participants: TransactionFormValues["participants"],
): SplitRow[] {
  const memberIds = new Set(members.map((member) => member.userId));
  return [
    ...members.map((member) => ({ userId: member.userId, name: member.name, isFormer: false })),
    ...participants.flatMap((participant) =>
      participant.memberId === undefined || memberIds.has(participant.memberId)
        ? []
        : [{ userId: participant.memberId, name: participant.memberName, isFormer: true }],
    ),
  ];
}

/** One line of the participants list for a contact the split can include. */
export type ContactSplitRow = { contactId: number; name: string; isArchived: boolean };

/**
 * The contacts the split lists: the active ones, then an archived contact the row already carries, so
 * its share can be seen, changed or removed. An archived contact never appears on a row without it.
 */
export function contactSplitRows(
  contacts: Pick<Contact, "id" | "name">[],
  participants: TransactionFormValues["participants"],
): ContactSplitRow[] {
  const activeIds = new Set(contacts.map((contact) => contact.id));
  return [
    ...contacts.map((contact) => ({ contactId: contact.id, name: contact.name, isArchived: false })),
    ...participants.flatMap((participant) =>
      participant.contactId === undefined || activeIds.has(participant.contactId)
        ? []
        : [{ contactId: participant.contactId, name: participant.memberName, isArchived: true }],
    ),
  ];
}

function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day);
}

function stripInstallmentSuffix(description: string) {
  return description.replace(/\s*\(\d+\/\d+\)$/, "");
}

function attributionToPayload(
  values: TransactionFormOutput,
  showAttribution: boolean,
  currentUserId?: number,
): { participants?: ParticipantInput[]; splitMode?: SplitMode } {
  if (!showAttribution) {
    return { participants: undefined, splitMode: undefined };
  }

  if (values.attributionMode === "ME") {
    return currentUserId != null
      ? { participants: [{ memberId: currentUserId }], splitMode: "EQUAL" }
      : { participants: undefined, splitMode: undefined };
  }

  if (values.attributionMode === "SOMEONE") {
    const person = values.participants[0];
    return person
      ? { participants: [{ memberId: person.memberId }], splitMode: "EQUAL" }
      : { participants: undefined, splitMode: undefined };
  }

  return {
    participants: values.participants.map((participant) => ({
      // Exactly one of the two travels: a contact's share names no member.
      ...(participant.contactId !== undefined
        ? { contactId: participant.contactId }
        : { memberId: participant.memberId }),
      shareAmount:
        values.splitMode === "EXACT" ? (participant.shareAmount ?? undefined) : undefined,
    })),
    splitMode: values.splitMode,
  };
}

/**
 * What the PUT would clear if an edit left it out: the form has no field for the parcel count or the end
 * date. A neutral movement also reads who it is on, since its form shows no attribution.
 */
type StoredPeriod = Pick<Transaction, "parcelsNumber" | "endDate"> &
  Partial<Pick<Transaction, "participants">>;

/** A neutral movement has one payer: the row's own when it has just one, otherwise whoever is saving. */
function neutralAttribution(
  values: TransactionFormOutput,
  stored: StoredPeriod | undefined,
  currentUserId: number | undefined,
): TransactionFormOutput {
  const payer = stored?.participants?.length === 1 ? stored.participants[0] : undefined;
  if (!payer || payer.id === null || payer.id === currentUserId) {
    return { ...values, attributionMode: "ME" };
  }
  return {
    ...values,
    attributionMode: "SOMEONE",
    participants: [{ memberId: payer.id, memberName: payer.name, shareAmount: null }],
  };
}

function tickedAllocations(
  rows: NonNullable<TransactionFormOutput["allocations"]>,
): RepaymentAllocationInput[] {
  return rows.flatMap((row) =>
    row.checked && row.amount !== null ? [{ participantId: row.participantId, amount: row.amount }] : [],
  );
}

function datePart(isoDate: string | null | undefined): string | undefined {
  return isoDate ? isoDate.split("T")[0] : undefined;
}

/**
 * @param stored The transaction being edited. The API replaces the whole transaction and the form
 *   has no field for its parcel count or end date, so they travel back as stored; its payer travels
 *   back too when it is a neutral movement.
 */
export function toPayload(
  values: TransactionFormOutput,
  showAttribution: boolean,
  currentUserId?: number,
  stored?: StoredPeriod,
): Omit<UpdateTransactionRequest["body"], "version"> {
  // A neutral movement has no category or items and one payer; the backend refuses anything else.
  const neutral = isNeutralKind(values.kind);
  const repayment = values.kind === "REPAYMENT";
  // A contact payment's one member is who received it, which its form lets the user choose.
  const { participants, splitMode } = attributionToPayload(
    neutral && !repayment ? neutralAttribution(values, stored, currentUserId) : values,
    showAttribution,
    currentUserId,
  );

  return {
    type: values.type,
    // The PUT clears a kind it does not carry, so an edit always sends the one chosen.
    kind: values.kind ?? undefined,
    description: values.description,
    amount: values.amount,
    categoryId: neutral ? undefined : values.category?.id,
    startDate: toIsoDate(values.date),
    parcelsNumber: stored?.parcelsNumber ?? undefined,
    endDate: datePart(stored?.endDate),
    splitMode,
    participants,
    contactId: repayment ? values.repaymentContact?.id : undefined,
    // Sent explicitly, ticked or not: an omitted list would have the server settle the oldest first.
    allocations: repayment ? tickedAllocations(values.allocations ?? []) : undefined,
    items: hidesItems(values.kind)
      ? []
      : values.items.map((item) => ({
          description: item.description,
          amount: item.amount,
          categoryId: item.category?.id,
        })),
  };
}

/**
 * The update a table cell edit sends. The API replaces the whole transaction, so every field the cell
 * did not change is sent back as the transaction has it (dates as their `yyyy-MM-dd` part), its
 * items included (the API requires them, and an empty list would remove them) and its parcel count
 * and end date (an installment would lose them).
 */
export function toInlineSavePayload(
  transaction: Transaction,
  change: InlineSaveBody,
): UpdateTransactionRequest {
  return {
    params: { id: transaction.id },
    body: {
      type: transaction.type,
      kind: transaction.kind ?? undefined,
      description: change.description ?? transaction.description,
      amount: change.amount ?? transaction.amount,
      categoryId: change.categoryId ?? transaction.category?.id,
      startDate: change.startDate ?? transaction.startDate.split("T")[0],
      parcelsNumber: transaction.parcelsNumber ?? undefined,
      endDate: datePart(transaction.endDate),
      splitMode: change.splitMode ?? transaction.splitMode,
      participants:
        change.participants ??
        transaction.participants.map((p) => ({
          ...(p.id === null ? { contactId: p.contactId ?? undefined } : { memberId: p.id }),
          shareAmount:
            transaction.splitMode === "EXACT" ? p.shareAmount : undefined,
        })),
      items: transaction.items.map((item) => ({
        description: item.description,
        amount: item.amount,
        quantity: item.quantity,
        categoryId: item.category?.id,
      })),
      // A contact payment keeps who paid and what it settles: the PUT replaces the whole row, and an
      // omitted list would have the server settle the oldest purchases again.
      contactId: transaction.repayment?.contactId,
      allocations: transaction.repayment?.allocations.map(({ participantId, amount }) => ({
        participantId,
        amount,
      })),
      version: transaction.version,
    },
  };
}

export function toSeriesCreatePayload(
  values: TransactionFormOutput,
  showAttribution: boolean,
  currentUserId?: number,
): CreateTransactionSeriesRequest["body"] {
  const { participants, splitMode } = attributionToPayload(
    values,
    showAttribution,
    currentUserId,
  );

  return {
    type: values.type,
    description: values.description,
    amount: values.amount,
    categoryId: values.category?.id,
    mode: values.recurrenceMode!,
    startDate: toIsoDate(values.date),
    parcelsNumber:
      values.recurrenceMode === "INSTALLMENT" ? (values.parcelsNumber ?? undefined) : undefined,
    currentParcel:
      values.recurrenceMode === "INSTALLMENT" && (values.currentParcel ?? 1) > 1
        ? (values.currentParcel ?? undefined)
        : undefined,
    interval: values.recurrenceMode === "RECURRING" ? "MONTHLY" : undefined,
    endDate:
      values.recurrenceMode === "RECURRING" && values.endDate
        ? toIsoDate(values.endDate)
        : undefined,
    splitMode,
    participants,
    requiresConfirmation: values.requiresConfirmation,
  };
}

export function toSeriesEditPayload(
  values: TransactionFormOutput,
  transaction: Transaction,
  definition: RecurrenceDefinitionResponse,
  scope: SeriesEditScope,
  showAttribution: boolean,
  currentUserId?: number,
): UpdateTransactionSeriesRequest["body"] {
  const { participants, splitMode } = attributionToPayload(
    values,
    showAttribution,
    currentUserId,
  );

  return {
    scope,
    pivotOccurrenceId: transaction.id,
    // Null leaves the pivot's date alone: the API refuses a date with "Todas", so it is sent only when it changed.
    pivotDate: seriesDateChanged(transaction, values.date) ? toIsoDate(values.date) : null,
    series: {
      type: definition.type,
      amount: values.amount,
      description: values.description,
      categoryId: values.category?.id,
      mode: definition.mode,
      startDate: definition.startDate,
      parcelsNumber:
        definition.mode === "INSTALLMENT" ? (values.parcelsNumber ?? undefined) : undefined,
      interval: definition.interval,
      endDate:
        definition.mode === "RECURRING" && values.endDate
          ? toIsoDate(values.endDate)
          : undefined,
      splitMode,
      participants,
      requiresConfirmation: values.requiresConfirmation,
    },
    version: definition.version,
    // Only an occurrence that requires confirmation shows the Status control; for any other the
    // field is not the user's answer, so nothing is sent and the server leaves it as it is.
    pivotConfirmed: transaction.requiresConfirmation ? values.confirmed : undefined,
  };
}

/** A stored share as the form holds it: a member's by `memberId`, a contact's by `contactId`. */
function participantToFormValues(participant: ParticipantShare): TransactionFormValues["participants"] {
  if (participant.id !== null) {
    return [
      { memberId: participant.id, memberName: participant.name, shareAmount: participant.shareAmount },
    ];
  }
  if (participant.contactId == null) return [];
  return [
    {
      contactId: participant.contactId,
      memberName: participant.contactName ?? participant.name,
      shareAmount: participant.shareAmount,
    },
  ];
}

export function buildDefaultValues(
  transaction?: Transaction,
  currentUserId?: number,
  definition?: RecurrenceDefinitionResponse,
): TransactionFormValues {
  if (transaction) {
    const attributionMode = deriveAttributionMode(
      transaction.participants,
      currentUserId,
    );
    const isSeriesEdit = !!definition;
    return {
      type: transaction.type,
      kind: transaction.kind ?? null,
      description: isSeriesEdit
        ? stripInstallmentSuffix(transaction.description)
        : transaction.description,
      amount: transaction.amount,
      category: transaction.category ?? null,
      date: parseLocalDate(transaction.startDate),
      recurring: false,
      seriesEdit: isSeriesEdit,
      requiresConfirmation: definition?.requiresConfirmation ?? true,
      confirmed: transaction.status === "ACTUAL",
      recurrenceMode: isSeriesEdit ? definition.mode : undefined,
      parcelsNumber:
        isSeriesEdit && definition.mode === "INSTALLMENT"
          ? (definition.parcelsNumber ?? null)
          : undefined,
      endDate:
        isSeriesEdit && definition.mode === "RECURRING" && definition.endDate
          ? parseLocalDate(definition.endDate)
          : undefined,
      original: isSeriesEdit
        ? {
            date: parseLocalDate(transaction.startDate),
            parcelsNumber:
              definition.mode === "INSTALLMENT" ? (definition.parcelsNumber ?? null) : null,
          }
        : undefined,
      attributionMode,
      splitMode: transaction.splitMode === "EXACT" ? "EXACT" : "EQUAL",
      participants:
        attributionMode === "ME"
          ? []
          : transaction.participants.flatMap(participantToFormValues),
      repaymentContact: transaction.repayment
        ? { id: transaction.repayment.contactId, name: transaction.repayment.contactName }
        : null,
      allocations: [],
      items: isSeriesEdit
        ? []
        : transaction.items.map((item) => ({
            description: item.description,
            amount: item.amount,
            category: item.category ?? null,
          })),
    };
  }
  return {
    type: "DEBIT",
    kind: null,
    description: "",
    amount: null,
    category: null,
    date: new Date(),
    recurring: false,
    seriesEdit: false,
    requiresConfirmation: true,
    confirmed: false,
    attributionMode: "ME",
    splitMode: "EQUAL",
    participants: [],
    repaymentContact: null,
    allocations: [],
    items: [],
  };
}

/**
 * What the form opens with: the row edited or duplicated, or a new row, which a preset may start as a
 * contact payment from its contact. A preset never changes a row that already exists.
 */
export function initialFormValues(
  mode: TransactionFormMode,
  transaction: Transaction | undefined,
  currentUserId: number | undefined,
  definition: RecurrenceDefinitionResponse | undefined,
  preset: AddTransactionPreset | undefined,
): TransactionFormValues {
  const defaults = buildDefaultValues(transaction, currentUserId, definition);
  if (mode !== "create" || !preset) return defaults;
  return {
    ...defaults,
    type: "CREDIT",
    kind: "REPAYMENT",
    description: preset.description,
    repaymentContact: preset.contact,
  };
}
