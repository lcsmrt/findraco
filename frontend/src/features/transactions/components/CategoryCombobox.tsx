import { Category } from "@/api/dtos";
import { TransactionType } from "@/api/dtos/transaction";
import {
  ALL_CATEGORIES_PAGE_SIZE,
  useGetCategories,
} from "@/api/services/useCategoryService";
import { useMemo, useState } from "react";
import { useCategoryFormSheet } from "@/hooks/useCategoryFormSheet";
import { groupCategoryOptions } from "../utils/categoryOptions";
import { CategoryComboboxView } from "./CategoryComboboxView";

type CategoryComboboxProps = {
  id?: string;
  value: Category | null | undefined;
  onValueChange: (
    value: Category | null | undefined,
  ) => void;
  type?: TransactionType;
  disabled?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function CategoryCombobox({
  id,
  value,
  onValueChange,
  type,
  disabled,
  defaultOpen,
  onOpenChange,
}: CategoryComboboxProps) {
  const { openCreate } = useCategoryFormSheet();

  const [search, setSearch] = useState("");

  const { data: categories, isLoading } = useGetCategories({
    size: ALL_CATEGORIES_PAGE_SIZE,
    filter: { type },
  });

  const options = useMemo(
    () => groupCategoryOptions(categories?.content ?? [], search),
    [categories, search],
  );

  async function handleOpenCreate() {
    const created = await openCreate({ description: search.trim(), type });
    if (created) {
      onValueChange(created);
      setSearch("");
    }
  }

  function handleValueChange(next: Category | null | undefined) {
    onValueChange(next);
    setSearch("");
  }

  return (
    <CategoryComboboxView
      id={id}
      value={value}
      onValueChange={handleValueChange}
      options={options}
      isLoading={isLoading}
      search={search}
      onSearchChange={setSearch}
      onCreate={handleOpenCreate}
      onClear={() => onValueChange(null)}
      disabled={disabled}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    />
  );
}
