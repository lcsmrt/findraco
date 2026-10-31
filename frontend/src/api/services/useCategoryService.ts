import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { findracoApi } from "../clients/findracoApi";
import {
  CategorySpending,
  CategorySpendingFilter,
  CategoryUsage,
  CreateCategoryRequest,
  DeleteCategoryRequest,
  Category,
  CategorySortBy,
  PagedCategoriesFilter,
  PagedRequest,
  PagedResponse,
  UpdateCategoryRequest,
} from "../dtos";
import { MutationOptions } from "../types/mutationOptions";
import { QueryOptions } from "../types/queryOptions";
import { buildMutationOptions } from "../utils/buildMutationOptions";
import { buildPagedQuery } from "../utils/buildPagedQuery";
import { usePlanContext } from "@/app/providers/usePlanContext";

async function getCategories(
  planId: number,
  params?: PagedRequest<PagedCategoriesFilter, CategorySortBy>,
): Promise<PagedResponse<Category>> {
  const query = buildPagedQuery(params);
  const { data } = await findracoApi.get(
    `/plan/${planId}/category?${query}`,
  );
  return data;
}

/** Page size large enough to hold every category of a plan (≈25 in practice). */
export const ALL_CATEGORIES_PAGE_SIZE = 100;

export function useGetCategories(
  params?: PagedRequest<PagedCategoriesFilter, CategorySortBy>,
  options?: QueryOptions<PagedResponse<Category>>,
) {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getCategories(activePlanId!, params),
    queryKey: ["categories", activePlanId, params],
    ...options,
    enabled: activePlanId != null && (options?.enabled ?? true),
  });
}

async function getCategorySpending(
  planId: number,
  params: CategorySpendingFilter,
): Promise<CategorySpending[]> {
  const { data } = await findracoApi.get<CategorySpending[]>(
    `/plan/${planId}/category/spending`,
    { params },
  );
  return data;
}

export function useGetCategorySpending(
  params: CategorySpendingFilter,
  options?: QueryOptions<CategorySpending[]>,
) {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getCategorySpending(activePlanId!, params),
    queryKey: ["categorySpending", activePlanId, params],
    ...options,
    enabled: activePlanId != null && (options?.enabled ?? true),
  });
}

/** Every category mutation changes the category list, the spending tree and the dashboard breakdown. */
function invalidateCategoryViews(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ["categories"] });
  queryClient.invalidateQueries({ queryKey: ["categorySpending"] });
  queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
  queryClient.invalidateQueries({ queryKey: ["categoryUsage"] });
}

async function getCategoryUsage(
  planId: number,
  id: number,
): Promise<CategoryUsage> {
  const { data } = await findracoApi.get<CategoryUsage>(
    `/plan/${planId}/category/${id}/usage`,
  );
  return data;
}

export function categoryUsageKey(planId: number | null, id: number | null) {
  return ["categoryUsage", planId, id] as const;
}

export function useGetCategoryUsage(
  id: number | null,
  options?: QueryOptions<CategoryUsage>,
) {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getCategoryUsage(activePlanId!, id!),
    queryKey: categoryUsageKey(activePlanId, id),
    ...options,
    enabled: activePlanId != null && id != null && (options?.enabled ?? true),
  });
}

async function getCategory(
  planId: number,
  id: number,
): Promise<Category> {
  const { data } = await findracoApi.get(
    `/plan/${planId}/category/${id}`,
  );
  return data;
}

const CATEGORY_STALE_TIME_MS = 5 * 60 * 1000;

export function categoryKey(
  planId: number | null,
  id: number | null,
) {
  return ["category", planId, id] as const;
}

export function useGetCategory(
  id: number | null,
  options?: QueryOptions<Category>,
) {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getCategory(activePlanId!, id!),
    queryKey: categoryKey(activePlanId, id),
    // Fresh long enough that a seeded (setQueryData) category is not refetched on mount.
    staleTime: CATEGORY_STALE_TIME_MS,
    ...options,
    enabled: activePlanId != null && id != null && (options?.enabled ?? true),
  });
}

async function createCategory(
  planId: number,
  payload: CreateCategoryRequest,
): Promise<Category> {
  const { data } = await findracoApi.post(
    `/plan/${planId}/category`,
    payload.body,
  );
  return data;
}

export function useCreateCategory(
  options?: MutationOptions<
    Category,
    CreateCategoryRequest
  >,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: CreateCategoryRequest) =>
      createCategory(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "Category created." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateCategoryViews(queryClient);
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}

async function updateCategory(
  planId: number,
  payload: UpdateCategoryRequest,
): Promise<Category> {
  const { params, body } = payload;
  const { data } = await findracoApi.put(
    `/plan/${planId}/category/${params.id}`,
    body,
  );
  return data;
}

export function useUpdateCategory(
  options?: MutationOptions<
    Category,
    UpdateCategoryRequest
  >,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: UpdateCategoryRequest) =>
      updateCategory(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "Category updated." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateCategoryViews(queryClient);
        queryClient.invalidateQueries({
          queryKey: categoryKey(activePlanId, variables.params.id),
        });
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}

async function deleteCategory(
  planId: number,
  { id, reassignTo }: DeleteCategoryRequest,
): Promise<void> {
  await findracoApi.delete(
    `/plan/${planId}/category/${id}`,
    reassignTo != null ? { params: { reassignTo } } : undefined,
  );
}

export function useDeleteCategory(
  options?: MutationOptions<void, DeleteCategoryRequest>,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: DeleteCategoryRequest) =>
      deleteCategory(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "Category deleted." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateCategoryViews(queryClient);
        queryClient.invalidateQueries({
          queryKey: categoryKey(activePlanId, variables.id),
        });
        if (variables.reassignTo != null) {
          // Reassignment moved transactions to another category, so cached transaction lists
          // still show the deleted one.
          queryClient.invalidateQueries({ queryKey: ["transactions"] });
        }
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}
