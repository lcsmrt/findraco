import type {
  Category,
  TransactionType,
  PlanMember,
} from "@/api/dtos";
import { Badge } from "@/components/badge/base/Badge";
import { Button } from "@/components/button/base/Button";
import { DateRangePicker } from "@/components/input/DatePicker";
import { CurrencyInput } from "@/components/input/CurrencyInput";
import { Field, FieldLabel } from "@/components/input/base/Field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/input/base/Select";
import { StandardCombobox } from "@/components/input/StandardCombobox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/popover/base/Popover";
import { SlidersHorizontalIcon } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { countActiveFilters } from "../utils/activeFilterCount";
import { groupCategoryOptions } from "../utils/categoryOptions";
import {
  fromDraft,
  toDraft,
  TYPE_ALL,
  withDraftCategory,
  withDraftMember,
  type AppliedFilters,
  type FilterDraft,
  type MemberOption,
} from "../utils/transactionFilterDraft";

const TYPE_LABELS: Record<TransactionType | typeof TYPE_ALL, string> = {
  ALL: "All",
  CREDIT: "Credit",
  DEBIT: "Debit",
};

function toMemberOption(member: PlanMember): MemberOption {
  return {
    id: member.userId,
    name: member.name,
  };
}

type TransactionFilterPopoverViewProps = {
  appliedFilters: AppliedFilters;
  onApply: (filters: AppliedFilters) => void;
  members?: PlanMember[];
  /** Every category of the plan, ungrouped. */
  categories: Category[];
  isLoadingCategories: boolean;
};

export function TransactionFilterPopoverView({
  appliedFilters,
  onApply,
  members = [],
  categories: allCategories,
  isLoadingCategories,
}: TransactionFilterPopoverViewProps) {
  const fieldId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FilterDraft>(() =>
    toDraft(appliedFilters),
  );
  const [categorySearch, setCategorySearch] = useState("");

  // Grouped like the transaction form's picker; children carry their parent's
  // name because this shared combobox renders plain labels.
  const categoryOptions = useMemo(
    () => groupCategoryOptions(allCategories, categorySearch),
    [allCategories, categorySearch],
  );
  const categories = categoryOptions.map((o) => o.category);
  const parentNames = new Map(
    allCategories.map((c) => [c.id, c.description]),
  );
  function categoryLabel(c: (typeof categories)[number]) {
    const parentName = c.parentId != null ? parentNames.get(c.parentId) : undefined;
    return parentName ? `${parentName} › ${c.description}` : c.description;
  }

  function handleOpenChange(o: boolean) {
    if (o) setDraft(toDraft(appliedFilters));
    setOpen(o);
  }

  function handleApply() {
    onApply(fromDraft(draft));
    setOpen(false);
  }

  function handleReset() {
    onApply({ filter: {}, categoryForDisplay: null, memberForDisplay: null });
    setOpen(false);
  }

  const showMemberPicker = members.length > 1;

  const activeCount = countActiveFilters(appliedFilters.filter);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger render={<Button type="button" variant="outline" />}>
        <SlidersHorizontalIcon className="h-4 w-4" />
        Filters
        {activeCount > 0 && (
          <Badge>{activeCount}</Badge>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        aria-label="Filters"
        className="w-[min(20rem,calc(100vw-1rem))]"
      >
        <div className="flex flex-col gap-4 p-1">
          <Field>
            <FieldLabel htmlFor={`${fieldId}-type`}>Type</FieldLabel>
            <Select
              value={draft.type}
              items={TYPE_LABELS}
              onValueChange={(v) => {
                if (v !== null) {
                  setDraft((d) => ({ ...d, type: v }));
                }
              }}
            >
              <SelectTrigger id={`${fieldId}-type`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TYPE_ALL}>All</SelectItem>
                <SelectItem value="CREDIT">Credit</SelectItem>
                <SelectItem value="DEBIT">Debit</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${fieldId}-category`}>Category</FieldLabel>
            <StandardCombobox
              id={`${fieldId}-category`}
              items={categories}
              value={draft.category}
              onValueChange={(v) => setDraft((d) => withDraftCategory(d, v))}
              itemLabel={categoryLabel}
              placeholder="All categories"
              clearable
              searchValue={categorySearch}
              onSearchChange={setCategorySearch}
              loading={isLoadingCategories}
            />
          </Field>

          {showMemberPicker && (
            <Field>
              <FieldLabel htmlFor={`${fieldId}-member`}>Attributed to</FieldLabel>
              <StandardCombobox
                id={`${fieldId}-member`}
                items={members.map(toMemberOption)}
                value={draft.member}
                onValueChange={(v) => setDraft((d) => withDraftMember(d, v))}
                itemLabel={(m) => m.name}
                placeholder="All members"
                clearable
              />
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor={`${fieldId}-date`}>Date</FieldLabel>
            <DateRangePicker
              id={`${fieldId}-date`}
              value={draft.dateRange}
              onChange={(r) => setDraft((d) => ({ ...d, dateRange: r }))}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={`${fieldId}-amount-min`}>Amount</FieldLabel>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <CurrencyInput
                id={`${fieldId}-amount-min`}
                aria-label="Minimum amount"
                placeholder="R$ 0,00"
                value={draft.amountMin}
                onValueChange={(amountMin) => setDraft((d) => ({ ...d, amountMin }))}
              />
              <span className="text-muted-foreground hidden shrink-0 sm:block">–</span>
              <CurrencyInput
                aria-label="Maximum amount"
                placeholder="R$ 0,00"
                value={draft.amountMax}
                onValueChange={(amountMax) => setDraft((d) => ({ ...d, amountMax }))}
              />
            </div>
          </Field>

          <div className="flex items-center justify-between pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button type="button" size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
