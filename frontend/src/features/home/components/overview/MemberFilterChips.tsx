import { StandardCombobox } from "@/components/input/StandardCombobox";
import { cn } from "@/lib/mergeClasses";
import { getFirstName } from "@/utils/string/formatters";
import type { ReactNode } from "react";
import type { MemberOption } from "../../hooks/useOverviewMemberFilter";
import type { MemberColorOf } from "../../utils/memberColors";
import { MemberDot } from "./MemberDot";

/** Plans up to this size get chips; larger ones get a combobox (UX-04 AC 8). */
const MAX_CHIPS = 4;

type ChipProps = {
  selected: boolean;
  title?: string;
  onClick: () => void;
  children: ReactNode;
};

const Chip = ({ selected, title, onClick, children }: ChipProps) => (
  <button
    type="button"
    title={title}
    aria-pressed={selected}
    onClick={onClick}
    className={cn(
      "focus-visible:ring-ring/50 inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-xs font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px]",
      selected
        ? "border-foreground/80 bg-foreground text-background"
        : "border-border bg-card text-foreground hover:bg-muted",
    )}
  >
    {children}
  </button>
);

type MemberFilterChipsProps = {
  members: MemberOption[];
  selectedId: number | null;
  onChange: (member: MemberOption | null) => void;
  colorOf: MemberColorOf;
  className?: string;
};

/**
 * The Overview member filter (UX-04 AC 8): "All" plus a chip per member for 2–4
 * members (the chips double as the colour legend), a combobox with colour dots
 * for more, nothing for a single member.
 */
export const MemberFilterChips = ({
  members,
  selectedId,
  onChange,
  colorOf,
  className,
}: MemberFilterChipsProps) => {
  if (members.length <= 1) return null;

  if (members.length > MAX_CHIPS) {
    const selected = members.find((m) => m.id === selectedId) ?? null;
    return (
      <div className={cn("w-full sm:w-56", className)}>
        <StandardCombobox
          items={members}
          value={selected}
          onValueChange={onChange}
          itemLabel={(m) => m.name}
          renderItem={(m) => (
            <span className="flex items-center gap-2">
              <MemberDot color={colorOf(m.id)} />
              {m.name}
            </span>
          )}
          placeholder="All members"
          clearable
        />
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Filter by member"
      className={cn("flex flex-wrap items-center gap-1.5", className)}
    >
      <Chip selected={selectedId == null} onClick={() => onChange(null)}>
        All
      </Chip>
      {members.map((member) => (
        <Chip
          key={member.id}
          selected={member.id === selectedId}
          onClick={() => onChange(member)}
          title={member.name}
        >
          <MemberDot color={colorOf(member.id)} />
          {getFirstName(member.name)}
        </Chip>
      ))}
    </div>
  );
};
