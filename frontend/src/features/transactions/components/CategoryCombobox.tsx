import { FinancialTransactionCategory } from "@/api/dtos";
import { FinancialTransactionType } from "@/api/dtos/financialTransaction";
import {
  ALL_CATEGORIES_PAGE_SIZE,
  useGetFinancialTransactionCategories,
} from "@/api/services/useFinancialTransactionCategoryService";
import { Button } from "@/components/button/Button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/input/base/Combobox";
import { useComboboxAnchor } from "@/components/input/base/useComboboxAnchor";
import { InputGroupButton } from "@/components/input/base/InputGroup";
import { Spinner } from "@/components/spinner/Spinner";
import { cn } from "@/lib/mergeClasses";
import { PlusIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useCategoryFormSheet } from "@/hooks/useCategoryFormSheet";
import { groupCategoryOptions } from "../utils/categoryOptions";

type CategoryComboboxProps = {
  id?: string;
  value: FinancialTransactionCategory | null | undefined;
  onValueChange: (
    value: FinancialTransactionCategory | null | undefined,
  ) => void;
  type?: FinancialTransactionType;
  disabled?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const CategoryCombobox = ({
  id,
  value,
  onValueChange,
  type,
  disabled,
  defaultOpen,
  onOpenChange,
}: CategoryComboboxProps) => {
  const anchor = useComboboxAnchor();
  const { openCreate } = useCategoryFormSheet();

  const [search, setSearch] = useState("");

  const { data: categories, isLoading } = useGetFinancialTransactionCategories({
    size: ALL_CATEGORIES_PAGE_SIZE,
    filter: { type },
  });

  const options = useMemo(
    () => groupCategoryOptions(categories?.content ?? [], search),
    [categories, search],
  );
  const displayedItems = useMemo(() => options.map((o) => o.category), [options]);
  const childIds = useMemo(
    () => new Set(options.filter((o) => o.isChild).map((o) => o.category.id)),
    [options],
  );

  const handleOpenCreate = async () => {
    const created = await openCreate({ description: search.trim(), type });
    if (created) {
      onValueChange(created);
      setSearch("");
    }
  };

  const showClear = value !== null;

  return (
    <Combobox
      id={id}
      items={displayedItems}
      // Items arrive grouped and searched; the default filter would hide the
      // parent of a matching child.
      filter={null}
      value={value}
      onValueChange={(v) => {
        onValueChange(v);
        setSearch("");
      }}
      itemToStringLabel={(cat) => cat.description}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <div ref={anchor} className="relative">
        <ComboboxTrigger
          showChevron={false}
          render={
            <Button
              type="button"
              disabled={disabled}
              className={cn(
                "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 flex h-9 w-full cursor-pointer items-center justify-between rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                showClear && "pr-8",
              )}
            />
          }
        >
          <span className={cn(!value && "text-muted-foreground")}>
            {value ? value.description : "Select a category..."}
          </span>
        </ComboboxTrigger>
        {showClear && (
          <InputGroupButton
            type="button"
            tabIndex={-1}
            className="text-muted-foreground absolute top-1/2 right-1 -translate-y-1/2"
            onClick={(e) => {
              e.stopPropagation();
              onValueChange(null);
            }}
          >
            <XIcon className="h-3 w-3" />
          </InputGroupButton>
        )}
      </div>

      <ComboboxContent anchor={anchor}>
        <ComboboxInput
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          showTrigger={false}
          disabled={disabled}
        />
        {isLoading ? (
          <div className="text-muted-foreground flex items-center justify-center py-4">
            <Spinner />
          </div>
        ) : displayedItems.length === 0 && search.trim() ? (
          <div className="p-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleOpenCreate}
              className="text-primary-ink hover:bg-accent flex w-full cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm"
            >
              <PlusIcon className="h-3.5 w-3.5 shrink-0" />
              Create &ldquo;{search}&rdquo;
            </Button>
          </div>
        ) : (
          <ComboboxEmpty>No results</ComboboxEmpty>
        )}
        <ComboboxList>
          {(cat: FinancialTransactionCategory) => (
            <ComboboxItem
              key={String(cat.id)}
              value={cat}
              className={cn("px-2", childIds.has(cat.id) && "pl-6")}
            >
              <span
                className={cn(
                  "flex-1 truncate",
                  !childIds.has(cat.id) && "font-medium",
                )}
              >
                {cat.description}
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};
