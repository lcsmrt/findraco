import { StandardCombobox } from "@/components/input/StandardCombobox";
import { cn } from "@/lib/mergeClasses";
import { getFirstName } from "@/utils/string/formatters";
import type { MemberOption } from "../useOverviewMemberFilter";
import type { MemberColorOf } from "@/utils/memberColors";
import { MemberDot } from "@/components/memberDot/MemberDot";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/toggleGroup/base/ToggleGroup";

/** Plans up to this size get chips; larger ones get a combobox. */
const MAX_CHIPS = 4;

/** The chip value standing for "no member filter". */
const ALL = "all";

type MemberFilterChipsProps = {
  members: MemberOption[];
  selectedId: number | null;
  onChange: (member: MemberOption | null) => void;
  colorOf: MemberColorOf;
  className?: string;
};

/**
 * The Overview member filter: "All" plus a chip per member for 2–4
 * members (the chips double as the colour legend), a combobox with colour dots
 * for more, nothing for a single member.
 */
export function MemberFilterChips({
  members,
  selectedId,
  onChange,
  colorOf,
  className,
}: MemberFilterChipsProps) {
  if (members.length <= 1) return null;

  if (members.length > MAX_CHIPS) {
    const selected = members.find((m) => m.id === selectedId) ?? null;
    return (
      <div className={cn("w-full sm:w-56", className)}>
        <label htmlFor="overview-member-filter" className="sr-only">
          Filter by member
        </label>
        <StandardCombobox
          id="overview-member-filter"
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

  function handleValueChange([next]: string[]) {
    // Clicking the pressed chip would empty the group; the filter always has a choice.
    if (!next) return;
    onChange(members.find((member) => String(member.id) === next) ?? null);
  }

  return (
    <ToggleGroup
      aria-label="Filter by member"
      variant="chip"
      spacing={1.5}
      value={[selectedId == null ? ALL : String(selectedId)]}
      onValueChange={handleValueChange}
      className={className}
    >
      <ToggleGroupItem value={ALL}>All</ToggleGroupItem>
      {members.map((member) => (
        <ToggleGroupItem
          key={member.id}
          value={String(member.id)}
          title={member.name}
        >
          <MemberDot color={colorOf(member.id)} />
          {getFirstName(member.name)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
