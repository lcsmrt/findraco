import type { Category } from "@/api/dtos";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/api/services/useCategoryService";
import { toPayload, type CategoryFormOutput } from "./categoryForm";

type UseCategoryFormSubmitArgs = {
  /** The category being edited; `null` creates one. */
  editing: Category | null | undefined;
  /** Receives the saved category, so a caller can select it (a picker's "create" option). */
  onSuccess?: (category: Category) => void;
  onDone: () => void;
};

/** Submits the category form: updates the edited category or creates a new one. */
export function useCategoryFormSubmit({ editing, onSuccess, onDone }: UseCategoryFormSubmitArgs) {
  function handleSaved(category: Category) {
    onSuccess?.(category);
    onDone();
  }

  const createCategory = useCreateCategory({ onSuccess: handleSaved });
  const updateCategory = useUpdateCategory({ onSuccess: handleSaved });

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
