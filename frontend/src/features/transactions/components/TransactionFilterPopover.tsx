import type { Category, PlanMember } from "@/api/dtos";
import {
  ALL_CATEGORIES_PAGE_SIZE,
  useGetCategories,
} from "@/api/services/useCategoryService";
import type { AppliedFilters } from "../utils/transactionFilterDraft";
import { TransactionFilterPopoverView } from "./TransactionFilterPopoverView";

export type { AppliedFilters };

// A stable empty list while categories load, so the view's grouping is not recomputed every render.
const NO_CATEGORIES: Category[] = [];

type TransactionFilterPopoverProps = {
  appliedFilters: AppliedFilters;
  onApply: (filters: AppliedFilters) => void;
  members?: PlanMember[];
};

export function TransactionFilterPopover(props: TransactionFilterPopoverProps) {
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetCategories({ size: ALL_CATEGORIES_PAGE_SIZE });

  return (
    <TransactionFilterPopoverView
      {...props}
      categories={categoriesData?.content ?? NO_CATEGORIES}
      isLoadingCategories={isLoadingCategories}
    />
  );
}
