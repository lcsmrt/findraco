import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { findracoApi } from "../clients/findracoApi";
import {
  CreateTransactionRequest,
  ImportResultResponse,
  CreateTransactionSeriesRequest,
  Transaction,
  TransactionSeriesResponse,
  TransactionSortBy,
  PagedTransactionsFilter,
  PagedRequest,
  PagedResponse,
  RecurrenceDefinitionResponse,
  DeleteTransactionSeriesRequest,
  UpdateTransactionSeriesRequest,
  UpdateTransactionRequest,
} from "../dtos";
import { MutationOptions } from "../types/mutationOptions";
import { QueryOptions } from "../types/queryOptions";
import { buildMutationOptions } from "../utils/buildMutationOptions";
import { buildPagedQuery } from "../utils/buildPagedQuery";
import { importResultMessage } from "../utils/importResultMessage";
import { usePlanContext } from "@/app/providers/usePlanContext";

/**
 * A transaction write changes every view derived from transactions: the lists, the category usage
 * counts, the spending tree and the dashboard totals and trend. One list here keeps the mutations
 * from drifting apart. Not awaited: active queries refetch on their own, inactive ones turn stale.
 */
function invalidateTransactionData(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ["transactions"] });
  queryClient.invalidateQueries({ queryKey: ["categoryUsage"] });
  queryClient.invalidateQueries({ queryKey: ["categorySpending"] });
  queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
  queryClient.invalidateQueries({ queryKey: ["dashboardTrend"] });
}

async function getTransactions(
  planId: number,
  params?: PagedRequest<
    PagedTransactionsFilter,
    TransactionSortBy
  >,
): Promise<PagedResponse<Transaction>> {
  const query = buildPagedQuery(params);
  const { data } = await findracoApi.get(
    `/plan/${planId}/transaction?${query}`,
  );
  return data;
}

export function useGetTransactions(
  params?: PagedRequest<
    PagedTransactionsFilter,
    TransactionSortBy
  >,
  options?: QueryOptions<PagedResponse<Transaction>>,
) {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getTransactions(activePlanId!, params),
    queryKey: ["transactions", activePlanId, params],
    ...options,
    enabled: activePlanId != null && (options?.enabled ?? true),
  });
}

async function createTransaction(
  planId: number,
  payload: CreateTransactionRequest,
): Promise<Transaction> {
  const { data } = await findracoApi.post(
    `/plan/${planId}/transaction`,
    payload.body,
  );
  return data;
}

export function useCreateTransaction(
  options?: MutationOptions<
    Transaction,
    CreateTransactionRequest
  >,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: CreateTransactionRequest) =>
      createTransaction(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "Transaction added." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}

async function updateTransaction(
  planId: number,
  payload: UpdateTransactionRequest,
): Promise<Transaction> {
  const { params, body } = payload;
  const { data } = await findracoApi.put(
    `/plan/${planId}/transaction/${params.id}`,
    body,
  );
  return data;
}

export function useUpdateTransaction(
  options?: MutationOptions<
    Transaction,
    UpdateTransactionRequest
  >,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: UpdateTransactionRequest) =>
      updateTransaction(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "Transaction updated." }, {
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
): Promise<ImportResultResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await findracoApi.post(
    `/plan/${planId}/transaction/import`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data;
}

export function useImportNubankCsv(
  options?: MutationOptions<ImportResultResponse, File>,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (file: File) => importNubankCsv(activePlanId!, file),
    ...buildMutationOptions({ successMessage: importResultMessage }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}

async function createTransactionSeries(
  planId: number,
  payload: CreateTransactionSeriesRequest,
): Promise<TransactionSeriesResponse> {
  const { data } = await findracoApi.post(
    `/plan/${planId}/transaction/series`,
    payload.body,
  );
  return data;
}

export function useCreateTransactionSeries(
  options?: MutationOptions<
    TransactionSeriesResponse,
    CreateTransactionSeriesRequest
  >,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: CreateTransactionSeriesRequest) =>
      createTransactionSeries(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "Series created." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}

async function deleteTransactionSeries(
  planId: number,
  { seriesId, scope, pivotOccurrenceId }: DeleteTransactionSeriesRequest,
): Promise<void> {
  const query = new URLSearchParams({ scope });
  if (pivotOccurrenceId != null) {
    query.set("pivotOccurrenceId", String(pivotOccurrenceId));
  }
  await findracoApi.delete(
    `/plan/${planId}/transaction/series/${seriesId}?${query}`,
  );
}

export function useDeleteTransactionSeries(
  options?: MutationOptions<void, DeleteTransactionSeriesRequest>,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: DeleteTransactionSeriesRequest) =>
      deleteTransactionSeries(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "Series deleted." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        queryClient.invalidateQueries({
          queryKey: [
            "transactionSeries",
            activePlanId,
            variables.seriesId,
          ],
        });
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}

async function getTransactionSeries(
  planId: number,
  seriesId: string,
): Promise<RecurrenceDefinitionResponse> {
  const { data } = await findracoApi.get(
    `/plan/${planId}/transaction/series/${seriesId}`,
  );
  return data;
}

export function useGetTransactionSeries(
  seriesId: string | undefined,
  options?: QueryOptions<RecurrenceDefinitionResponse>,
) {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getTransactionSeries(activePlanId!, seriesId!),
    queryKey: ["transactionSeries", activePlanId, seriesId],
    ...options,
    enabled:
      activePlanId != null && seriesId != null && (options?.enabled ?? true),
  });
}

async function updateTransactionSeries(
  planId: number,
  payload: UpdateTransactionSeriesRequest,
): Promise<TransactionSeriesResponse> {
  const { params, body } = payload;
  const { data } = await findracoApi.put(
    `/plan/${planId}/transaction/series/${params.seriesId}`,
    body,
  );
  return data;
}

export function useUpdateTransactionSeries(
  options?: MutationOptions<
    TransactionSeriesResponse,
    UpdateTransactionSeriesRequest
  >,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: UpdateTransactionSeriesRequest) =>
      updateTransactionSeries(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "Series updated." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        queryClient.invalidateQueries({
          queryKey: ["transactionSeries", activePlanId, variables.params.seriesId],
        });
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}

async function deleteTransaction(
  planId: number,
  id: number,
): Promise<void> {
  await findracoApi.delete(`/plan/${planId}/transaction/${id}`);
}

export function useDeleteTransaction(
  options?: MutationOptions<void, number>,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (id: number) => deleteTransaction(activePlanId!, id),
    ...buildMutationOptions({ successMessage: "Transaction deleted." }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}
