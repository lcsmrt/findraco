import type { FinancialTransactionCategory } from "@/api/dtos";
import {
  CreateFinancialTransactionRequest,
  CreateFinancialTransactionSeriesRequest,
  FinancialTransaction,
  ParticipantInput,
  RecurrenceDefinitionResponse,
  SeriesEditScope,
  SplitMode,
  UpdateFinancialTransactionSeriesRequest,
} from "@/api/dtos/financialTransaction";
import type { PlanMember } from "@/api/dtos/plan";
import { toCents } from "@/utils/money";
import { format } from "date-fns";
import { z } from "zod";

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

export const transactionFormSchema = z
  .object({
    type: z.enum(["DEBIT", "CREDIT"]),
    description: z.string().min(1, "Description is required"),
    amount: z.number().nullable().refine(isPositiveAmount, "Amount must be positive"),
    category: z
      .object({
        id: z.number(),
        type: z.enum(["DEBIT", "CREDIT"]),
        description: z.string(),
        spendingLimit: z.number().nullish(),
      })
      .nullable()
      .optional(),
    date: z.date({ required_error: "Date is required" }),
    recurring: z.boolean(),
    seriesEdit: z.boolean(),
    recurrenceMode: z.enum(["INSTALLMENT", "RECURRING"]).optional(),
    /** Whole count; `null` or unset when empty. */
    parcelsNumber: z.number().nullable().optional(),
    /** Whole count; empty means the first installment. */
    currentParcel: z.number().nullable().optional(),
    endDate: z.date().optional(),
    attributionMode: z.enum(["ME", "SOMEONE", "SPLIT"]),
    splitMode: z.enum(["EQUAL", "EXACT"]),
    participants: z.array(
      z.object({
        memberId: z.number(),
        memberName: z.string(),
        shareAmount: z.number().nullable(),
      }),
    ),
    items: z.array(
      z.object({
        description: z.string().min(1, "Description is required"),
        amount: z.number().nullable().refine(isPositiveAmount, "Amount must be positive"),
        category: z
          .object({
            id: z.number(),
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
          message: "Items cannot exceed the transaction total",
          path: ["items"],
        });
      }
    }

    if (
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
          message: "Shares must add up to the total amount",
          path: ["participants"],
        });
      }
    }

    if (values.seriesEdit) {
      if (values.recurrenceMode === "INSTALLMENT") {
        if ((values.parcelsNumber ?? 0) < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter at least 2 installments",
            path: ["parcelsNumber"],
          });
        }
      }
      if (
        values.recurrenceMode === "RECURRING" &&
        values.endDate &&
        values.endDate < values.date
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The end date must be after the start date",
          path: ["endDate"],
        });
      }
      return;
    }

    if (!values.recurring) return;

    if (!values.recurrenceMode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select installment or recurring",
        path: ["recurrenceMode"],
      });
      return;
    }

    if (values.recurrenceMode === "INSTALLMENT") {
      const total = values.parcelsNumber ?? 0;
      if (total < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter at least 2 installments",
          path: ["parcelsNumber"],
        });
      }

      const current = values.currentParcel;
      if (current != null) {
        if (current < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "The current installment must be at least 1",
            path: ["currentParcel"],
          });
        } else if (total >= 2 && current > total) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "The current installment cannot be greater than the total",
            path: ["currentParcel"],
          });
        }
      }
    }

    if (values.recurrenceMode === "RECURRING") {
      if (values.endDate && values.endDate < values.date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The end date must be after the start date",
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
  participants: FinancialTransaction["participants"],
  currentUserId?: number,
): TransactionFormValues["attributionMode"] {
  if (participants.length === 0) return "ME";
  if (participants.length === 1) {
    return participants[0].id === currentUserId ? "ME" : "SOMEONE";
  }
  return "SPLIT";
}

type OwnerDefaultInput = {
  category: Pick<FinancialTransactionCategory, "ownerId"> | null | undefined;
  members: PlanMember[];
  currentUserId?: number;
  /** True once the user changed the attribution or participants by hand. */
  participantsTouched: boolean;
};

/**
 * The attribution an owned category implies (CAT-17): its owner as the single
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
 * The participants a newly selected category sets (CAT-17, P3 AC 6): its active
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
 * Whether a series edit changed an installment series' number of installments. That change rebuilds
 * the whole series, so it applies to every occurrence without asking for a scope.
 */
export function seriesParcelsChanged(
  definition: RecurrenceDefinitionResponse | undefined,
  parcelsNumber: number | null | undefined,
): boolean {
  return definition?.mode === "INSTALLMENT" && parcelsNumber !== (definition.parcelsNumber ?? null);
}

function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day);
}

const stripInstallmentSuffix = (description: string) =>
  description.replace(/\s*\(\d+\/\d+\)$/, "");

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
      memberId: participant.memberId,
      shareAmount:
        values.splitMode === "EXACT" ? (participant.shareAmount ?? undefined) : undefined,
    })),
    splitMode: values.splitMode,
  };
}

export function toPayload(
  values: TransactionFormOutput,
  showAttribution: boolean,
  currentUserId?: number,
): CreateFinancialTransactionRequest["body"] {
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
    startDate: format(values.date, "yyyy-MM-dd"),
    splitMode,
    participants,
    items: values.items.map((item) => ({
      description: item.description,
      amount: item.amount,
      categoryId: item.category?.id,
    })),
  };
}

export function toSeriesCreatePayload(
  values: TransactionFormOutput,
  showAttribution: boolean,
  currentUserId?: number,
): CreateFinancialTransactionSeriesRequest["body"] {
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
    startDate: format(values.date, "yyyy-MM-dd"),
    parcelsNumber:
      values.recurrenceMode === "INSTALLMENT" ? (values.parcelsNumber ?? undefined) : undefined,
    currentParcel:
      values.recurrenceMode === "INSTALLMENT" && (values.currentParcel ?? 1) > 1
        ? (values.currentParcel ?? undefined)
        : undefined,
    interval: values.recurrenceMode === "RECURRING" ? "MONTHLY" : undefined,
    endDate:
      values.recurrenceMode === "RECURRING" && values.endDate
        ? format(values.endDate, "yyyy-MM-dd")
        : undefined,
    splitMode,
    participants,
  };
}

export function toSeriesEditPayload(
  values: TransactionFormOutput,
  transaction: FinancialTransaction,
  definition: RecurrenceDefinitionResponse,
  scope: SeriesEditScope,
  showAttribution: boolean,
  currentUserId?: number,
): UpdateFinancialTransactionSeriesRequest["body"] {
  const { participants, splitMode } = attributionToPayload(
    values,
    showAttribution,
    currentUserId,
  );

  return {
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
        ? format(values.endDate, "yyyy-MM-dd")
        : undefined,
    splitMode,
    participants,
    scope,
    pivotOccurrenceId: transaction.id,
  };
}

export function buildDefaultValues(
  transaction?: FinancialTransaction,
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
      description: isSeriesEdit
        ? stripInstallmentSuffix(transaction.description)
        : transaction.description,
      amount: transaction.amount,
      category: transaction.category ?? null,
      date: parseLocalDate(transaction.startDate),
      recurring: false,
      seriesEdit: isSeriesEdit,
      recurrenceMode: isSeriesEdit ? definition.mode : undefined,
      parcelsNumber:
        isSeriesEdit && definition.mode === "INSTALLMENT"
          ? (definition.parcelsNumber ?? null)
          : undefined,
      endDate:
        isSeriesEdit && definition.mode === "RECURRING" && definition.endDate
          ? parseLocalDate(definition.endDate)
          : undefined,
      attributionMode,
      splitMode: transaction.splitMode === "EXACT" ? "EXACT" : "EQUAL",
      participants:
        attributionMode === "ME"
          ? []
          : transaction.participants.map((participant) => ({
              memberId: participant.id,
              memberName: participant.name,
              shareAmount: participant.shareAmount,
            })),
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
    description: "",
    amount: null,
    category: null,
    date: new Date(),
    recurring: false,
    seriesEdit: false,
    attributionMode: "ME",
    splitMode: "EQUAL",
    participants: [],
    items: [],
  };
}
