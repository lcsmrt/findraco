import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  DeletionResponse,
  RestoreDeletionResponse,
  TransactionTrashEntry,
  ImportResultResponse,
  LineProblem,
  NeutralCandidate,
  SetTransactionKindRequest,
  Problem,
  ProblemType,
  ConfirmTransactionRequest,
  CreateTransactionRequest,
  CreateTransactionSeriesRequest,
  Transaction,
  TransactionSeriesResponse,
  PagedResponse,
  RecurrenceDefinitionResponse,
  UpdateTransactionRequest,
  UpdateTransactionSeriesRequest,
} from "../dtos";

type PlanParams = { planId: string };
type TransactionParams = PlanParams & { id: string };
type SeriesParams = PlanParams & { seriesId: string };
type TrashParams = PlanParams & { deletionId: string };

const base = "*/plan/:planId/transaction";

export const transactionHandlers = {
  list(page: PagedResponse<Transaction>): HttpHandler {
    return http.get<PlanParams, never, PagedResponse<Transaction>>(base, () =>
      HttpResponse.json(page),
    );
  },
  neutralCandidates(page: PagedResponse<NeutralCandidate>): HttpHandler {
    return http.get<PlanParams, never, PagedResponse<NeutralCandidate>>(
      `${base}/neutral-candidates`,
      () => HttpResponse.json(page),
    );
  },
  setKind(transaction: Transaction): HttpHandler {
    return http.post<TransactionParams, SetTransactionKindRequest["body"], Transaction>(
      `${base}/:id/kind`,
      () => HttpResponse.json(transaction),
    );
  },
  setKindRejected(status: number, type: ProblemType): HttpHandler {
    return http.post<TransactionParams, SetTransactionKindRequest["body"], Problem>(
      `${base}/:id/kind`,
      () => HttpResponse.json({ type: `urn:findraco:problem:${type}`, status }, { status }),
    );
  },
  remove(deletionId = 1): HttpHandler {
    return http.delete<TransactionParams, never, DeletionResponse>(`${base}/:id`, () =>
      HttpResponse.json({ deletionId }),
    );
  },
  restore(restored = 1): HttpHandler {
    return http.post<TrashParams, never, RestoreDeletionResponse>(`${base}/trash/:deletionId/restore`, () =>
      HttpResponse.json({ restored }),
    );
  },
  restoreRejected(status: number, type: ProblemType): HttpHandler {
    return http.post<TrashParams, never, Problem>(`${base}/trash/:deletionId/restore`, () =>
      HttpResponse.json({ type: `urn:findraco:problem:${type}`, status }, { status }),
    );
  },
  trash(page: PagedResponse<TransactionTrashEntry>): HttpHandler {
    return http.get<PlanParams, never, PagedResponse<TransactionTrashEntry>>(`${base}/trash`, () =>
      HttpResponse.json(page),
    );
  },
  trashError(status = 500): HttpHandler {
    return http.get<PlanParams, never, Problem>(`${base}/trash`, () =>
      HttpResponse.json({ type: "urn:findraco:problem:internal", status }, { status }),
    );
  },
  importCsv(result: ImportResultResponse): HttpHandler {
    return http.post<PlanParams, never, ImportResultResponse>(`${base}/import`, () =>
      HttpResponse.json(result),
    );
  },
  importCsvRejected(status: number, type: ProblemType, errors: LineProblem[] = []): HttpHandler {
    return http.post<PlanParams, never, Problem>(`${base}/import`, () =>
      HttpResponse.json(
        { type: `urn:findraco:problem:${type}`, status, ...(errors.length > 0 && { errors }) },
        { status },
      ),
    );
  },
  series(definition: RecurrenceDefinitionResponse): HttpHandler {
    return http.get<SeriesParams, never, RecurrenceDefinitionResponse>(`${base}/series/:seriesId`, () =>
      HttpResponse.json(definition),
    );
  },
  removeSeries(deletionId = 1): HttpHandler {
    return http.delete<SeriesParams, never, DeletionResponse>(`${base}/series/:seriesId`, () =>
      HttpResponse.json({ deletionId }),
    );
  },
  create(transaction: Transaction): HttpHandler {
    return http.post<
      PlanParams,
      CreateTransactionRequest["body"],
      Transaction
    >(base, () => HttpResponse.json(transaction, { status: 201 }));
  },
  createSeries(series: TransactionSeriesResponse): HttpHandler {
    return http.post<
      PlanParams,
      CreateTransactionSeriesRequest["body"],
      TransactionSeriesResponse
    >(`${base}/series`, () => HttpResponse.json(series, { status: 201 }));
  },
  update(transaction: Transaction): HttpHandler {
    return http.put<
      TransactionParams,
      UpdateTransactionRequest["body"],
      Transaction
    >(`${base}/:id`, () => HttpResponse.json(transaction));
  },
  confirm(transaction: Transaction): HttpHandler {
    return http.post<
      TransactionParams,
      ConfirmTransactionRequest["body"],
      Transaction
    >(`${base}/:id/confirm`, () => HttpResponse.json(transaction));
  },
  confirmRejected(status: number, type: ProblemType): HttpHandler {
    return http.post<TransactionParams, ConfirmTransactionRequest["body"], Problem>(`${base}/:id/confirm`, () =>
      HttpResponse.json({ type: `urn:findraco:problem:${type}`, status }, { status }),
    );
  },
  updateRejected(status: number, type: ProblemType): HttpHandler {
    return http.put<TransactionParams, UpdateTransactionRequest["body"], Problem>(`${base}/:id`, () =>
      HttpResponse.json({ type: `urn:findraco:problem:${type}`, status }, { status }),
    );
  },
  createRejected(status: number, type: ProblemType): HttpHandler {
    return http.post<PlanParams, CreateTransactionRequest["body"], Problem>(base, () =>
      HttpResponse.json({ type: `urn:findraco:problem:${type}`, status }, { status }),
    );
  },
  updateSeries(series: TransactionSeriesResponse): HttpHandler {
    return http.put<
      SeriesParams,
      UpdateTransactionSeriesRequest["body"],
      TransactionSeriesResponse
    >(`${base}/series/:seriesId`, () => HttpResponse.json(series));
  },
  updateSeriesRejected(status: number, type: ProblemType): HttpHandler {
    return http.put<SeriesParams, UpdateTransactionSeriesRequest["body"], Problem>(
      `${base}/series/:seriesId`,
      () =>
        HttpResponse.json(
          { type: `urn:findraco:problem:${type}`, status },
          { status, headers: { "Content-Type": "application/problem+json" } },
        ),
    );
  },
};
