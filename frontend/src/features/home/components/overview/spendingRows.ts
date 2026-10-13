import type { CategorySpending, CategorySpendingMember } from "@/api/dtos";
import { scaleTreeLimits, type ScaledNode } from "../../utils/scaleLimits";

/** Share of the limit from which a row reads as a warning (UX-03 AC 3). */
export const WARNING_RATIO = 0.8;

export type SpendingStatus = "ok" | "warning" | "over" | "none";

export type Usage = {
  status: SpendingStatus;
  /** Whole-number percent of the limit used; null without a limit (UX-03 AC 8). */
  percent: number | null;
  /** Left before the limit; null without a limit or when over. */
  remaining: number | null;
  /** Spend beyond the limit; null unless over. */
  overBy: number | null;
};

export type BarSegment = {
  memberId: number;
  amount: number;
  color: string;
  /** Another member is selected (UX-04 AC 7). */
  dimmed: boolean;
  /** Width in percent of the bar (the bar spans max(spent, limit)). */
  widthPct: number;
};

export type Bar = {
  segments: BarSegment[];
  /** Position of the limit tick in percent, only when over (UX-03 AC 5). */
  limitTickPct: number | null;
};

export type MemberAmount = {
  memberId: number;
  name: string;
  amount: number;
  color: string;
  dimmed: boolean;
};

export type MemberSubRow = Usage & {
  memberId: number;
  name: string;
  color: string;
  spent: number;
  limit: number | null;
  /** false for a former member: shown greyed, never evaluated (CAT-14). */
  active: boolean;
  bar: Bar | null;
};

/** "<member> X of Y · shared limit L" for a selected member without a limit of their own (UX-04 AC 7). */
export type MemberFocus = {
  memberId: number;
  name: string;
  color: string;
  spent: number;
  of: number;
  sharedLimit: number | null;
};

export type OwnerPill = {
  memberId: number;
  name: string;
  color: string;
  active: boolean;
};

export type SpendingRow = Usage & {
  categoryId: number;
  name: string;
  depth: 0 | 1;
  /** The spend the row shows: the whole category, or the selected member's against their own limit. */
  spent: number;
  limit: number | null;
  /** Null when the row has no limit: no bar and no track (UX-03 AC 2). */
  bar: Bar | null;
  memberLine: MemberAmount[];
  memberSubRows: MemberSubRow[];
  focus: MemberFocus | null;
  owner: OwnerPill | null;
  children: SpendingRow[];
};

export type SelectedMember = { id: number; name: string };

export type SpendingRowsInput = {
  tree: CategorySpending[];
  monthCount: number;
  selectedMember: SelectedMember | null;
  colorOf: (memberId: number) => string;
};

export type SpendingRowsView = {
  rows: SpendingRow[];
  /** Roots open on load: those with a child in warning or over (UX-03 AC 6). */
  defaultExpandedIds: number[];
};

type Row = ScaledNode<CategorySpending>;

const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name, undefined, { sensitivity: "base" });

/** Status, integer percent and remaining / over-by of a spend against a limit (UX-03 AC 3–4, 8). */
export const usageOf = (spent: number, limit: number | null | undefined): Usage => {
  if (limit == null) return { status: "none", percent: null, remaining: null, overBy: null };
  if (spent > limit) {
    return {
      status: "over",
      percent: limit === 0 ? 0 : Math.round((spent / limit) * 100),
      remaining: null,
      overBy: spent - limit,
    };
  }
  const ratio = limit === 0 ? 0 : spent / limit;
  return {
    status: ratio >= WARNING_RATIO ? "warning" : "ok",
    percent: Math.round(ratio * 100),
    remaining: limit - spent,
    overBy: null,
  };
};

type SegmentInput = Omit<BarSegment, "widthPct">;

const buildBar = (segments: SegmentInput[], spent: number, limit: number | null): Bar | null => {
  if (limit == null) return null;
  const span = Math.max(spent, limit);
  const pct = (value: number) => (span === 0 ? 0 : (value / span) * 100);
  return {
    segments: segments
      .filter((segment) => segment.amount > 0)
      .map((segment) => ({ ...segment, widthPct: pct(segment.amount) })),
    limitTickPct: spent > limit ? pct(limit) : null,
  };
};

const spendingMembers = (row: Row) =>
  row.members.filter((member) => member.spent !== 0);

const memberSubRow = (member: CategorySpendingMember, colorOf: (id: number) => string): MemberSubRow => {
  const color = colorOf(member.memberId);
  const usage = member.active
    ? usageOf(member.spent, member.limit)
    : usageOf(member.spent, null);
  return {
    ...usage,
    memberId: member.memberId,
    name: member.name,
    color,
    spent: member.spent,
    limit: member.limit,
    active: member.active,
    bar: member.active
      ? buildBar(
          [{ memberId: member.memberId, amount: member.spent, color, dimmed: false }],
          member.spent,
          member.limit,
        )
      : null,
  };
};

const toRow = (row: Row, depth: 0 | 1, input: SpendingRowsInput): SpendingRow => {
  const { selectedMember, colorOf } = input;
  const limit = row.limit ?? null;
  const owner: OwnerPill | null =
    row.ownerId != null
      ? {
          memberId: row.ownerId,
          name: row.ownerName ?? "",
          color: colorOf(row.ownerId),
          active: row.ownerActive !== false,
        }
      : null;

  // Owned rows count the owner's spend only (CAT-16): one segment in the owner's colour.
  const rowShares: { memberId: number; amount: number }[] = owner
    ? [{ memberId: owner.memberId, amount: row.spent }]
    : spendingMembers(row).map((m) => ({ memberId: m.memberId, amount: m.spent }));

  const isDimmed = (memberId: number) =>
    selectedMember != null && memberId !== selectedMember.id;

  const memberLine: MemberAmount[] = spendingMembers(row).map((member) => ({
    memberId: member.memberId,
    name: member.name,
    amount: member.spent,
    color: colorOf(member.memberId),
    dimmed: isDimmed(member.memberId),
  }));

  const children = row.children
    .map((child) => toRow(child, 1, input))
    .sort(byName);

  const ownEntry = selectedMember
    ? row.members.find(
        (member) =>
          member.memberId === selectedMember.id && member.active && member.limit != null,
      )
    : undefined;

  if (selectedMember && ownEntry && !owner) {
    // The member's own limit: their spend against it (UX-04 AC 6).
    const color = colorOf(ownEntry.memberId);
    return {
      ...usageOf(ownEntry.spent, ownEntry.limit),
      categoryId: row.categoryId,
      name: row.name,
      depth,
      spent: ownEntry.spent,
      limit: ownEntry.limit,
      bar: buildBar(
        [{ memberId: ownEntry.memberId, amount: ownEntry.spent, color, dimmed: false }],
        ownEntry.spent,
        ownEntry.limit,
      ),
      memberLine,
      memberSubRows: [],
      focus: null,
      owner,
      children,
    };
  }

  const segments = rowShares.map((share) => ({
    memberId: share.memberId,
    amount: share.amount,
    color: colorOf(share.memberId),
    dimmed: isDimmed(share.memberId),
  }));

  // Without a limit of their own, the selected member is shown inside the whole category,
  // never evaluated against the whole limit (UX-04 AC 7).
  // An owned row selected by its owner is that member's own row.
  const focus: MemberFocus | null =
    selectedMember && selectedMember.id !== owner?.memberId
    ? {
        memberId: selectedMember.id,
        name: selectedMember.name,
        color: colorOf(selectedMember.id),
        spent: rowShares.find((share) => share.memberId === selectedMember.id)?.amount ?? 0,
        of: row.spent,
        sharedLimit: limit,
      }
    : null;

  return {
    ...usageOf(row.spent, limit),
    categoryId: row.categoryId,
    name: row.name,
    depth,
    spent: row.spent,
    limit,
    bar: buildBar(segments, row.spent, limit),
    memberLine,
    memberSubRows: selectedMember
      ? []
      : row.members
          .filter((member) => member.limit != null)
          .map((member) => memberSubRow(member, colorOf)),
    focus,
    owner,
    children,
  };
};

const needsAttention = (row: SpendingRow) =>
  row.status === "warning" || row.status === "over";

/**
 * The Overview spending list (UX-03, UX-04): DEBIT roots and their children sorted by
 * name, limits scaled to the period, member segments and sub-rows, and the roots that
 * open on load.
 */
export const buildSpendingRows = (input: SpendingRowsInput): SpendingRowsView => {
  const debit = input.tree.filter((root) => root.type === "DEBIT");
  const rows = scaleTreeLimits(debit, input.monthCount)
    .map((root) => toRow(root, 0, input))
    .sort(byName);
  return {
    rows,
    defaultExpandedIds: rows
      .filter((root) => root.children.some(needsAttention))
      .map((root) => root.categoryId),
  };
};
