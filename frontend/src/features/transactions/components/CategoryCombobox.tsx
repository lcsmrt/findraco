import { Category } from "@/api/dtos";
import { i18n } from "@/i18n/i18n";
import { TransactionType } from "@/api/dtos/transaction";
import {
  ALL_CATEGORIES_PAGE_SIZE,
  useCreateCategory,
  useGetCategories,
} from "@/api/services/useCategoryService";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { useMemo, useState } from "react";
import { groupCategoryOptions } from "../utils/categoryOptions";
import { categoryQuickCreate } from "../utils/categoryQuickCreate";
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
  const { canManageCategories } = usePlanPermissions();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(defaultOpen ?? false);

  const { data: categories, isLoading } = useGetCategories({
    size: ALL_CATEGORIES_PAGE_SIZE,
    filter: { type },
  });

  const options = useMemo(
    () => groupCategoryOptions(categories?.content ?? [], search),
    [categories, search],
  );

  const quickCreate = categoryQuickCreate({
    search,
    type,
    categories: categories?.content ?? [],
    canManageCategories,
  });

  // A failure keeps the search and the picker as they are; the service shows the problem's copy.
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory({
    successMessage: (created) =>
      i18n.t("transactions.categoryCombobox.created", { name: created.description }),
    onSuccess: (created) => {
      onValueChange(created);
      setSearch("");
      handleOpenChange(false);
    },
  });

  function handleCreate() {
    if (!quickCreate || !type) return;
    createCategory({ body: { type, description: quickCreate.description } });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    onOpenChange?.(next);
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
      quickCreate={quickCreate && { label: quickCreate.label, disabled: isCreating }}
      onCreate={handleCreate}
      onClear={() => onValueChange(null)}
      disabled={disabled}
      open={open}
      onOpenChange={handleOpenChange}
    />
  );
}
