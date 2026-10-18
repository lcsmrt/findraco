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
  CreateFinancialTransactionCategoryRequest,
  DeleteFinancialTransactionCategoryRequest,
  FinancialTransactionCategory,
  FinancialTransactionCategorySortBy,
  PagedFinancialTransactionCategoriesFilter,
  PagedRequest,
  PagedResponse,
  UpdateFinancialTransactionCategoryRequest,
} from "../dtos";
import { MutationOptions } from "../types/mutationOptions";
import { QueryOptions } from "../types/queryOptions";
import { buildMutationOptions } from "../utils/buildMutationOptions";
import { buildPagedQuery } from "../utils/buildPagedQuery";
import { usePlanContext } from "@/app/providers/usePlanContext";

const getFinancialTransactionCategories = async (
  planId: number,
  params?: PagedRequest<PagedFinancialTransactionCategoriesFilter, FinancialTransactionCategorySortBy>,
): Promise<PagedResponse<FinancialTransactionCategory>> => {
  const query = buildPagedQuery(params);
  const { data } = await findracoApi.get(
    `/plan/${planId}/financial-transaction-category?${query}`,
  );
  return data;
};

/** Page size large enough to hold every category of a plan (≈25 in practice). */
export const ALL_CATEGORIES_PAGE_SIZE = 100;

export const useGetFinancialTransactionCategories = (
  params?: PagedRequest<PagedFinancialTransactionCategoriesFilter, FinancialTransactionCategorySortBy>,
  options?: QueryOptions<PagedResponse<FinancialTransactionCategory>>,
) => {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getFinancialTransactionCategories(activePlanId!, params),
    queryKey: ["financialTransactionCategories", activePlanId, params],
    ...options,
    enabled: activePlanId != null && (options?.enabled ?? true),
  });
};

const getCategorySpending = async (
  planId: number,
  params: CategorySpendingFilter,
): Promise<CategorySpending[]> => {
  const { data } = await findracoApi.get<CategorySpending[]>(
    `/plan/${planId}/financial-transaction-category/spending`,
    { params },
  );
  return data;
};

export const useGetCategorySpending = (
  params: CategorySpendingFilter,
  options?: QueryOptions<CategorySpending[]>,
) => {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getCategorySpending(activePlanId!, params),
    queryKey: ["categorySpending", activePlanId, params],
    ...options,
    enabled: activePlanId != null && (options?.enabled ?? true),
  });
};

/** Every category mutation changes the category list, the spending tree and the dashboard breakdown. */
const invalidateCategoryViews = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["financialTransactionCategories"] });
  queryClient.invalidateQueries({ queryKey: ["categorySpending"] });
  queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
  queryClient.invalidateQueries({ queryKey: ["categoryUsage"] });
};

const getCategoryUsage = async (
  planId: number,
  id: number,
): Promise<CategoryUsage> => {
  const { data } = await findracoApi.get<CategoryUsage>(
    `/plan/${planId}/financial-transaction-category/${id}/usage`,
  );
  return data;
};

export const categoryUsageKey = (planId: number | null, id: number | null) =>
  ["categoryUsage", planId, id] as const;

export const useGetCategoryUsage = (
  id: number | null,
  options?: QueryOptions<CategoryUsage>,
) => {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getCategoryUsage(activePlanId!, id!),
    queryKey: categoryUsageKey(activePlanId, id),
    ...options,
    enabled: activePlanId != null && id != null && (options?.enabled ?? true),
  });
};

const getFinancialTransactionCategory = async (
  planId: number,
  id: number,
): Promise<FinancialTransactionCategory> => {
  const { data } = await findracoApi.get(
    `/plan/${planId}/financial-transaction-category/${id}`,
  );
  return data;
};

const CATEGORY_STALE_TIME_MS = 5 * 60 * 1000;

export const financialTransactionCategoryKey = (
  planId: number | null,
  id: number | null,
) => ["financialTransactionCategory", planId, id] as const;

export const useGetFinancialTransactionCategory = (
  id: number | null,
  options?: QueryOptions<FinancialTransactionCategory>,
) => {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getFinancialTransactionCategory(activePlanId!, id!),
    queryKey: financialTransactionCategoryKey(activePlanId, id),
    // Fresh long enough that a seeded (setQueryData) category is not refetched on mount.
    staleTime: CATEGORY_STALE_TIME_MS,
    ...options,
    enabled: activePlanId != null && id != null && (options?.enabled ?? true),
  });
};

const createFinancialTransactionCategory = async (
  planId: number,
  payload: CreateFinancialTransactionCategoryRequest,
): Promise<FinancialTransactionCategory> => {
  const { data } = await findracoApi.post(
    `/plan/${planId}/financial-transaction-category`,
    payload.body,
  );
  return data;
};

export const useCreateFinancialTransactionCategory = (
  options?: MutationOptions<
    FinancialTransactionCategory,
    CreateFinancialTransactionCategoryRequest
  >,
) => {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: CreateFinancialTransactionCategoryRequest) =>
      createFinancialTransactionCategory(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "Category created successfully." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateCategoryViews(queryClient);
        options?.onSuccess?.(data, variables);
      },
    }),
  });
};

const updateFinancialTransactionCategory = async (
  planId: number,
  payload: UpdateFinancialTransactionCategoryRequest,
): Promise<FinancialTransactionCategory> => {
  const { params, body } = payload;
  const { data } = await findracoApi.put(
    `/plan/${planId}/financial-transaction-category/${params.id}`,
    body,
  );
  return data;
};

export const useUpdateFinancialTransactionCategory = (
  options?: MutationOptions<
    FinancialTransactionCategory,
    UpdateFinancialTransactionCategoryRequest
  >,
) => {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: UpdateFinancialTransactionCategoryRequest) =>
      updateFinancialTransactionCategory(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "Category updated successfully." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateCategoryViews(queryClient);
        queryClient.invalidateQueries({
          queryKey: financialTransactionCategoryKey(activePlanId, variables.params.id),
        });
        options?.onSuccess?.(data, variables);
      },
    }),
  });
};

const deleteFinancialTransactionCategory = async (
  planId: number,
  { id, reassignTo }: DeleteFinancialTransactionCategoryRequest,
): Promise<void> => {
  await findracoApi.delete(
    `/plan/${planId}/financial-transaction-category/${id}`,
    reassignTo != null ? { params: { reassignTo } } : undefined,
  );
};

export const useDeleteFinancialTransactionCategory = (
  options?: MutationOptions<void, DeleteFinancialTransactionCategoryRequest>,
) => {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: DeleteFinancialTransactionCategoryRequest) =>
      deleteFinancialTransactionCategory(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "Category deleted successfully." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateCategoryViews(queryClient);
        queryClient.invalidateQueries({
          queryKey: financialTransactionCategoryKey(activePlanId, variables.id),
        });
        if (variables.reassignTo != null) {
          // Reassignment moved transactions to another category.
          queryClient.invalidateQueries({ queryKey: ["financialTransactions"] });
        }
        options?.onSuccess?.(data, variables);
      },
    }),
  });
};
