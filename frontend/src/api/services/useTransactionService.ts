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
  ConfirmTransactionRequest,
  DeletionResponse,
  RestoreDeletionResponse,
  TransactionTrashEntry,
  NeutralCandidate,
  SetTransactionKindRequest,
} from "../dtos";
import { MutationOptions } from "../types/mutationOptions";
import { QueryOptions } from "../types/queryOptions";
import { buildMutationOptions } from "../utils/buildMutationOptions";
import { buildPagedQuery } from "../utils/buildPagedQuery";
import { importResultMessage } from "../utils/importResultMessage";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { problemToast } from "../utils/problems";
import { i18n } from "@/i18n/i18n";
import { toast } from "sonner";

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
  queryClient.invalidateQueries({ queryKey: ["transactionTrash"] });
  // A row that gained a kind, or a new import, changes what the review still lists.
  queryClient.invalidateQueries({ queryKey: ["neutralCandidates"] });
}

/**
 * The success toast of a delete, with "Undo": using it restores that deletion and says so. A restore
 * the server refuses (the entry expired, the series changed) shows the reason in place of the success.
 */
function toastDeletedWithUndo(
  queryClient: QueryClient,
  planId: number,
  messageKey: "api.toast.transactionDeleted" | "api.toast.seriesDeleted",
  { deletionId }: DeletionResponse,
) {
  toast.success(i18n.t(messageKey), {
    action: {
      label: i18n.t("api.toast.undo"),
      onClick: () => {
        restoreDeletion(planId, deletionId).then(
          () => {
            invalidateTransactionData(queryClient);
            toast.success(i18n.t("api.toast.transactionRestored"));
          },
          (error: unknown) => {
            const { message, description } = problemToast(error);
            toast.error(message, description ? { description } : undefined);
          },
        );
      },
    },
  });
}

async function restoreDeletion(
  planId: number,
  deletionId: number,
): Promise<RestoreDeletionResponse> {
  const { data } = await findracoApi.post(
    `/plan/${planId}/transaction/trash/${deletionId}/restore`,
  );
  return data;
}

export function useRestoreDeletion(
  options?: MutationOptions<RestoreDeletionResponse, number>,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (deletionId: number) => restoreDeletion(activePlanId!, deletionId),
    ...buildMutationOptions({ successMessage: "api.toast.transactionRestored" }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}

async function getTransactionTrash(
  planId: number,
  params?: PagedRequest,
): Promise<PagedResponse<TransactionTrashEntry>> {
  const query = buildPagedQuery(params);
  const { data } = await findracoApi.get(
    `/plan/${planId}/transaction/trash?${query}`,
  );
  return data;
}

export function useGetTransactionTrash(
  params?: PagedRequest,
  options?: QueryOptions<PagedResponse<TransactionTrashEntry>>,
) {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getTransactionTrash(activePlanId!, params),
    queryKey: ["transactionTrash", activePlanId, params],
    ...options,
    enabled: activePlanId != null && (options?.enabled ?? true),
  });
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

async function getNeutralCandidates(
  planId: number,
  params?: PagedRequest,
): Promise<PagedResponse<NeutralCandidate>> {
  const query = buildPagedQuery(params);
  const { data } = await findracoApi.get(
    `/plan/${planId}/transaction/neutral-candidates?${query}`,
  );
  return data;
}

export function useGetNeutralCandidates(
  params?: PagedRequest,
  options?: QueryOptions<PagedResponse<NeutralCandidate>>,
) {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getNeutralCandidates(activePlanId!, params),
    queryKey: ["neutralCandidates", activePlanId, params],
    ...options,
    enabled: activePlanId != null && (options?.enabled ?? true),
  });
}

async function setTransactionKind(
  planId: number,
  { params, body }: SetTransactionKindRequest,
): Promise<Transaction> {
  const { data } = await findracoApi.post(
    `/plan/${planId}/transaction/${params.id}/kind`,
    body,
  );
  return data;
}

export function useSetTransactionKind(
  options?: MutationOptions<Transaction, SetTransactionKindRequest>,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: SetTransactionKindRequest) =>
      setTransactionKind(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "api.toast.kindApplied" }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        options?.onSuccess?.(data, variables);
      },
    }),
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
    ...buildMutationOptions({ successMessage: "api.toast.transactionAdded" }, {
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
    ...buildMutationOptions({ successMessage: "api.toast.transactionUpdated" }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}

async function confirmTransaction(
  planId: number,
  { params, body }: ConfirmTransactionRequest,
): Promise<Transaction> {
  const { data } = await findracoApi.post(
    `/plan/${planId}/transaction/${params.id}/confirm`,
    body,
  );
  return data;
}

export function useConfirmTransaction(
  options?: MutationOptions<Transaction, ConfirmTransactionRequest>,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: ConfirmTransactionRequest) =>
      confirmTransaction(activePlanId!, payload),
    ...buildMutationOptions({ successMessage: "api.toast.transactionConfirmed" }, {
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
    ...buildMutationOptions({ successMessage: "api.toast.seriesCreated" }, {
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
): Promise<DeletionResponse> {
  const query = new URLSearchParams({ scope });
  if (pivotOccurrenceId != null) {
    query.set("pivotOccurrenceId", String(pivotOccurrenceId));
  }
  const { data } = await findracoApi.delete(
    `/plan/${planId}/transaction/series/${seriesId}?${query}`,
  );
  return data;
}

export function useDeleteTransactionSeries(
  options?: MutationOptions<DeletionResponse, DeleteTransactionSeriesRequest>,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: DeleteTransactionSeriesRequest) =>
      deleteTransactionSeries(activePlanId!, payload),
    ...buildMutationOptions({ showSuccessToast: false }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        if (options?.showSuccessToast !== false) {
          toastDeletedWithUndo(queryClient, activePlanId!, "api.toast.seriesDeleted", data);
        }
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
    ...buildMutationOptions({ successMessage: "api.toast.seriesUpdated" }, {
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
): Promise<DeletionResponse> {
  const { data } = await findracoApi.delete(`/plan/${planId}/transaction/${id}`);
  return data;
}

export function useDeleteTransaction(
  options?: MutationOptions<DeletionResponse, number>,
) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (id: number) => deleteTransaction(activePlanId!, id),
    ...buildMutationOptions({ showSuccessToast: false }, {
      ...options,
      onSuccess: (data, variables) => {
        invalidateTransactionData(queryClient);
        if (options?.showSuccessToast !== false) {
          toastDeletedWithUndo(queryClient, activePlanId!, "api.toast.transactionDeleted", data);
        }
        options?.onSuccess?.(data, variables);
      },
    }),
  });
}
