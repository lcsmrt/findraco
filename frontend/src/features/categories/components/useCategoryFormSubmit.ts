import type { FinancialTransactionCategory } from "@/api/dtos";
import {
  useCreateFinancialTransactionCategory,
  useUpdateFinancialTransactionCategory,
} from "@/api/services/useFinancialTransactionCategoryService";
import { toPayload, type CategoryFormOutput } from "./categoryForm";

type UseCategoryFormSubmitArgs = {
  /** The category being edited; `null` creates one. */
  editing: FinancialTransactionCategory | null | undefined;
  /** Receives the saved category, so a caller can select it (a picker's "create" option). */
  onSuccess?: (category: FinancialTransactionCategory) => void;
  onDone: () => void;
};

/** Submits the category form: updates the edited category or creates a new one. */
export function useCategoryFormSubmit({ editing, onSuccess, onDone }: UseCategoryFormSubmitArgs) {
  function handleSaved(category: FinancialTransactionCategory) {
    onSuccess?.(category);
    onDone();
  }

  const createCategory = useCreateFinancialTransactionCategory({ onSuccess: handleSaved });
  const updateCategory = useUpdateFinancialTransactionCategory({ onSuccess: handleSaved });

  function submit(values: CategoryFormOutput) {
    const body = toPayload(values);
    if (editing) {
      updateCategory.mutate({ params: { id: editing.id }, body });
      return;
    }
    createCategory.mutate({ body });
  }

  return { submit, isSubmitting: createCategory.isPending || updateCategory.isPending };
}
