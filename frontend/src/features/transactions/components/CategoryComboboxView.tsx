import { Category } from "@/api/dtos";
import { Button } from "@/components/button/base/Button";
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
import { Spinner } from "@/components/spinner/base/Spinner";
import { Text } from "@/components/typography/base/Text";
import { cn } from "@/lib/mergeClasses";
import { PlusIcon, XIcon } from "lucide-react";
import { useMemo } from "react";
import type { CategoryOption } from "../utils/categoryOptions";

type CategoryComboboxViewProps = {
  id?: string;
  value: Category | null | undefined;
  onValueChange: (
    value: Category | null | undefined,
  ) => void;
  /** Grouped and already filtered by `search`. */
  options: CategoryOption[];
  isLoading: boolean;
  search: string;
  onSearchChange: (search: string) => void;
  onCreate: () => void;
  onClear: () => void;
  disabled?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function CategoryComboboxView({
  id,
  value,
  onValueChange,
  options,
  isLoading,
  search,
  onSearchChange,
  onCreate,
  onClear,
  disabled,
  defaultOpen,
  onOpenChange,
}: CategoryComboboxViewProps) {
  const anchor = useComboboxAnchor();
  const displayedItems = useMemo(() => options.map((o) => o.category), [options]);
  const childIds = useMemo(
    () => new Set(options.filter((o) => o.isChild).map((o) => o.category.id)),
    [options],
  );

  const showClear = value !== null;

  return (
    <Combobox
      id={id}
      items={displayedItems}
      // Items arrive grouped and searched; the default filter would hide the
      // parent of a matching child.
      filter={null}
      value={value}
      onValueChange={onValueChange}
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
                "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 flex h-9 w-full cursor-pointer items-center justify-between rounded-md border bg-transparent px-3 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                showClear && "pr-8",
              )}
            />
          }
        >
          <Text className={cn(!value && "text-muted-foreground")}>
            {value ? value.description : "Select a category..."}
          </Text>
        </ComboboxTrigger>
        {showClear && (
          <InputGroupButton
            type="button"
            tabIndex={-1}
            aria-label="Clear category"
            className="text-muted-foreground absolute top-1/2 right-1 -translate-y-1/2"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
          >
            <XIcon className="h-3 w-3" />
          </InputGroupButton>
        )}
      </div>

      <ComboboxContent anchor={anchor} aria-label="Categories">
        <ComboboxInput
          placeholder="Search..."
          aria-label="Search categories"
          value={search}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
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
              onClick={onCreate}
              className="text-primary-ink hover:bg-accent flex h-7 w-full cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5"
            >
              <PlusIcon className="size-3.5 shrink-0" />
              Create &ldquo;{search}&rdquo;
            </Button>
          </div>
        ) : (
          <ComboboxEmpty>No results</ComboboxEmpty>
        )}
        <ComboboxList>
          {(cat: Category) => (
            <ComboboxItem
              key={String(cat.id)}
              value={cat}
              className={cn("px-2", childIds.has(cat.id) && "pl-6")}
            >
              <Text
                variant={childIds.has(cat.id) ? "body" : "label"}
                className="flex-1 truncate"
              >
                {cat.description}
              </Text>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
