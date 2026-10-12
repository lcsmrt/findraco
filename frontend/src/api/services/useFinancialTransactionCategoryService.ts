import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { findracoApi } from "../clients/findracoApi";
import {
  CreateFinancialTransactionCategoryRequest,
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
import { usePlanContext } from "@/app/providers/PlanProvider";

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
        queryClient.invalidateQueries({ queryKey: ["financialTransactionCategories"] });
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
        queryClient.invalidateQueries({ queryKey: ["financialTransactionCategories"] });
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
  id: number,
): Promise<void> => {
  await findracoApi.delete(
    `/plan/${planId}/financial-transaction-category/${id}`,
  );
};

export const useDeleteFinancialTransactionCategory = (
  options?: MutationOptions<void, number>,
) => {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (id: number) =>
      deleteFinancialTransactionCategory(activePlanId!, id),
    ...buildMutationOptions({ successMessage: "Category deleted successfully." }, {
      ...options,
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["financialTransactionCategories"] });
        queryClient.invalidateQueries({
          queryKey: financialTransactionCategoryKey(activePlanId, variables),
        });
        options?.onSuccess?.(data, variables);
      },
    }),
  });
};
