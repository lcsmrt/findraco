import { FinancialTransactionCategory } from "@/api/dtos";
import { FinancialTransactionType } from "@/api/dtos/financialTransaction";
import {
  ALL_CATEGORIES_PAGE_SIZE,
  useGetFinancialTransactionCategories,
} from "@/api/services/useFinancialTransactionCategoryService";
import { useMemo, useState } from "react";
import { useCategoryFormSheet } from "@/hooks/useCategoryFormSheet";
import { groupCategoryOptions } from "../utils/categoryOptions";
import { CategoryComboboxView } from "./CategoryComboboxView";

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

  const { data: categories, isLoading } = useGetFinancialTransactionCategories({
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

  function handleValueChange(next: FinancialTransactionCategory | null | undefined) {
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
