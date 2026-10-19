import { Badge } from "@/components/badge/base/Badge";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/input/base/Combobox";
import { useComboboxAnchor } from "@/components/input/base/useComboboxAnchor";
import { Text } from "@/components/typography/base/Text";
import { cn } from "@/lib/mergeClasses";
import * as React from "react";

type WithId = { id: number | string };

function defaultEqual<T extends WithId>(a: T, b: T) {
  return a.id === b.id;
}

export type StandardMultiCombobox<T extends WithId> = {
  id?: string;
  items: T[];
  value: T[];
  onValueChange: (value: T[]) => void;
  itemLabel: (item: T) => string;
  placeholder?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  isItemEqualToValue?: (a: T, b: T) => boolean;
  emptyMessage?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  /** Maximum number of chips displayed. The rest are indicated with a "+N" badge. Default: 3. */
  maxVisibleChips?: number;
}

export function StandardMultiCombobox<T extends WithId>({
  id,
  items,
  value,
  onValueChange,
  itemLabel,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  searchValue: externalSearch,
  onSearchChange,
  isItemEqualToValue = defaultEqual,
  emptyMessage = "No results",
  disabled,
  className,
  maxVisibleChips = 3,
}: StandardMultiCombobox<T>) {
  const anchor = useComboboxAnchor();
  const [internalSearch, setInternalSearch] = React.useState("");

  const isSearchControlled = externalSearch !== undefined;
  const searchTerm = isSearchControlled ? externalSearch : internalSearch;

  function handleSearchChange(val: string) {
    if (!isSearchControlled) setInternalSearch(val);
    onSearchChange?.(val);
  }

  function handleValueChange(val: T[]) {
    if (val.length === 0 && value.length > 0 && displayedItems.length === 0)
      return;
    onValueChange(val);
    if (!isSearchControlled) setInternalSearch("");
  }

  const displayedItems = React.useMemo(() => {
    if (isSearchControlled) return items;
    const q = searchTerm.trim().toLowerCase();
    return q
      ? items.filter((item) => itemLabel(item).toLowerCase().includes(q))
      : items;
  }, [items, searchTerm, isSearchControlled, itemLabel]);

  const visibleChips = value.slice(0, maxVisibleChips);
  const overflowCount = value.length - visibleChips.length;

  return (
    <Combobox
      id={id}
      items={displayedItems}
      value={value}
      onValueChange={handleValueChange}
      itemToStringLabel={itemLabel}
      isItemEqualToValue={isItemEqualToValue}
      multiple
    >
      <div ref={anchor} className="w-full min-w-0">
        <ComboboxTrigger
          disabled={disabled}
          showChevron={false}
          render={
            <ComboboxChips
              className={cn(
                "focus-within:border-input w-full flex-nowrap overflow-hidden focus-within:ring-0",
                className,
              )}
              aria-disabled={disabled || undefined}
              // The chips are a div, which a <label htmlFor> cannot name, so the field takes the
              // name its placeholder gives it.
              aria-label={placeholder}
            />
          }
        >
          {visibleChips.map((item) => (
            <ComboboxChip key={String(item.id)}>
              <span className="max-w-28 truncate">{itemLabel(item)}</span>
            </ComboboxChip>
          ))}
          {value.length === 0 && (
            <Text variant="secondary" className="flex-1">
              {placeholder}
            </Text>
          )}
          {overflowCount > 0 && (
            <Badge variant="secondary">+{overflowCount}</Badge>
          )}
        </ComboboxTrigger>
      </div>

      {/* The popup is a dialog holding the search field and the list; it needs a name too. */}
      <ComboboxContent anchor={anchor} aria-label={placeholder}>
        <ComboboxInput
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.currentTarget.value)}
          showTrigger={false}
          disabled={disabled}
        />
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        {/* Every caller names the field through its placeholder, so the list reuses it. */}
        <ComboboxList aria-label={placeholder}>
          {(item: T) => (
            <ComboboxItem key={String(item.id)} value={item}>
              {itemLabel(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
