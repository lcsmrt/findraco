import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { findracoApi } from "../clients/findracoApi";
import {
  CreateFinancialTransactionRequest,
  CreateFinancialTransactionSeriesRequest,
  FinancialTransaction,
  FinancialTransactionSeriesResponse,
  FinancialTransactionSortBy,
  PagedFinancialTransactionsFilter,
  PagedRequest,
  PagedResponse,
  RecurrenceDefinitionResponse,
  DeleteFinancialTransactionSeriesRequest,
  UpdateFinancialTransactionSeriesRequest,
  UpdateFinancialTransactionRequest,
} from "../dtos";
import { MutationOptions } from "../types/mutationOptions";
import { QueryOptions } from "../types/queryOptions";
import { buildMutationOptions } from "../utils/buildMutationOptions";
import { buildPagedQuery } from "../utils/buildPagedQuery";
import { usePlanContext } from "@/app/providers/usePlanContext";

/**
 * A transaction write changes every view derived from transactions: the lists, the category usage
 * counts, the spending tree and the dashboard totals and trend. One list here keeps the mutations
 * from drifting apart. Not awaited: active queries refetch on their own, inactive ones turn stale.
 */
function invalidateTransactionData(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ["financialTransactions"] });
  queryClient.invalidateQueries({ queryKey: ["categoryUsage"] });
  queryClient.invalidateQueries({ queryKey: ["categorySpending"] });
  queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
  queryClient.invalidateQueries({ queryKey: ["dashboardTrend"] });
}

async function getFinancialTransactions(
  planId: number,
  params?: PagedRequest<
    PagedFinancialTransactionsFilter,
    FinancialTransactionSortBy
  >,
): Promise<PagedResponse<FinancialTransaction>> {
  const query = buildPagedQuery(params);
  const { data } = await findracoApi.get(
    `/plan/${planId}/financial-transaction?${query}`,
  );
  return data;
}

export function useGetFinancialTransactions(
  params?: PagedRequest<
    PagedFinancialTransactionsFilter,
    FinancialTransactionSortBy
  >,
  options?: QueryOptions<PagedResponse<FinancialTransaction>>,
) {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getFinancialTransactions(activePlanId!, params),
    queryKey: ["financialTransactions", activePlanId, params],
    ...options,
    enabled: activePlanId != null && (options?.enabled ?? true),
  });
}

async function createFinancialTransaction(
  planId: number,
  payload: CreateFinancialTransactionRequest,
): Promise<FinancialTransaction> {
  const { data } = await findracoApi.post(
    `/plan/${planId}/financial-transaction`,
    payload.body,
  );
  return data;
}

export function useCreateFinancialTransaction(
  options?: MutationOptions<
    FinancialTransaction,
    CreateFinancialTransactionRequest
  >,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: CreateFinancialTransactionRequest) =>
      createFinancialTransaction(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "Transaction created successfully." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}

async function updateFinancialTransaction(
  planId: number,
  payload: UpdateFinancialTransactionRequest,
): Promise<FinancialTransaction> {
  const { params, body } = payload;
  const { data } = await findracoApi.put(
    `/plan/${planId}/financial-transaction/${params.id}`,
    body,
  );
  return data;
}

export function useUpdateFinancialTransaction(
  options?: MutationOptions<
    FinancialTransaction,
    UpdateFinancialTransactionRequest
  >,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: UpdateFinancialTransactionRequest) =>
      updateFinancialTransaction(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "Transaction updated successfully." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}

async function importNubankCsv(
  planId: number,
  file: File,
): Promise<{ imported: number }> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await findracoApi.post(
    `/plan/${planId}/financial-transaction/import`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data;
}

export function useImportNubankCsv(
  options?: MutationOptions<{ imported: number }, File>,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (file: File) => importNubankCsv(activePlanId!, file),
    ...buildMutationOptions({ successMessage: "Transactions imported successfully." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}

async function createFinancialTransactionSeries(
  planId: number,
  payload: CreateFinancialTransactionSeriesRequest,
): Promise<FinancialTransactionSeriesResponse> {
  const { data } = await findracoApi.post(
    `/plan/${planId}/financial-transaction/series`,
    payload.body,
  );
  return data;
}

export function useCreateFinancialTransactionSeries(
  options?: MutationOptions<
    FinancialTransactionSeriesResponse,
    CreateFinancialTransactionSeriesRequest
  >,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: CreateFinancialTransactionSeriesRequest) =>
      createFinancialTransactionSeries(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "Series created successfully." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}

async function deleteFinancialTransactionSeries(
  planId: number,
  { seriesId, scope, pivotOccurrenceId }: DeleteFinancialTransactionSeriesRequest,
): Promise<void> {
  const query = new URLSearchParams({ scope });
  if (pivotOccurrenceId != null) {
    query.set("pivotOccurrenceId", String(pivotOccurrenceId));
  }
  await findracoApi.delete(
    `/plan/${planId}/financial-transaction/series/${seriesId}?${query}`,
  );
}

export function useDeleteFinancialTransactionSeries(
  options?: MutationOptions<void, DeleteFinancialTransactionSeriesRequest>,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: DeleteFinancialTransactionSeriesRequest) =>
      deleteFinancialTransactionSeries(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "Series deleted successfully." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        queryClient.invalidateQueries({
          queryKey: [
            "financialTransactionSeries",
            activePlanId,
            variables.seriesId,
          ],
        });
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}

async function getFinancialTransactionSeries(
  planId: number,
  seriesId: string,
): Promise<RecurrenceDefinitionResponse> {
  const { data } = await findracoApi.get(
    `/plan/${planId}/financial-transaction/series/${seriesId}`,
  );
  return data;
}

export function useGetFinancialTransactionSeries(
  seriesId: string | undefined,
  options?: QueryOptions<RecurrenceDefinitionResponse>,
) {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getFinancialTransactionSeries(activePlanId!, seriesId!),
    queryKey: ["financialTransactionSeries", activePlanId, seriesId],
    ...options,
    enabled:
      activePlanId != null && seriesId != null && (options?.enabled ?? true),
  });
}

async function updateFinancialTransactionSeries(
  planId: number,
  payload: UpdateFinancialTransactionSeriesRequest,
): Promise<FinancialTransactionSeriesResponse> {
  const { params, body } = payload;
  const { data } = await findracoApi.put(
    `/plan/${planId}/financial-transaction/series/${params.seriesId}`,
    body,
  );
  return data;
}

export function useUpdateFinancialTransactionSeries(
  options?: MutationOptions<
    FinancialTransactionSeriesResponse,
    UpdateFinancialTransactionSeriesRequest
  >,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: UpdateFinancialTransactionSeriesRequest) =>
      updateFinancialTransactionSeries(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "Series updated successfully." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        queryClient.invalidateQueries({
          queryKey: ["financialTransactionSeries", activePlanId, variables.params.seriesId],
        });
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}

async function deleteFinancialTransaction(
  planId: number,
  id: number,
): Promise<void> {
  await findracoApi.delete(`/plan/${planId}/financial-transaction/${id}`);
}

export function useDeleteFinancialTransaction(
  options?: MutationOptions<void, number>,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (id: number) => deleteFinancialTransaction(activePlanId!, id),
    ...buildMutationOptions({ successMessage: "Transaction deleted successfully." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}
