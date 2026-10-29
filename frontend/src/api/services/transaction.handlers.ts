import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  Problem,
  ProblemType,
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

const base = "*/plan/:planId/transaction";

export const transactionHandlers = {
  list(page: PagedResponse<Transaction>): HttpHandler {
    return http.get<PlanParams, never, PagedResponse<Transaction>>(base, () =>
      HttpResponse.json(page),
    );
  },
  remove(): HttpHandler {
    return http.delete<TransactionParams>(`${base}/:id`, () => new HttpResponse(null, { status: 204 }));
  },
  importCsv(result: { imported: number }): HttpHandler {
    return http.post<PlanParams, never, { imported: number }>(`${base}/import`, () =>
      HttpResponse.json(result),
    );
  },
  importCsvRejected(status: number, type: ProblemType): HttpHandler {
    return http.post<PlanParams, never, Problem>(`${base}/import`, () =>
      HttpResponse.json({ type: `urn:findraco:problem:${type}`, status }, { status }),
    );
  },
  series(definition: RecurrenceDefinitionResponse): HttpHandler {
    return http.get<SeriesParams, never, RecurrenceDefinitionResponse>(`${base}/series/:seriesId`, () =>
      HttpResponse.json(definition),
    );
  },
  removeSeries(): HttpHandler {
    return http.delete<SeriesParams>(`${base}/series/:seriesId`, () => new HttpResponse(null, { status: 204 }));
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
};
