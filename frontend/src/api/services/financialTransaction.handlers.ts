import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  CreateFinancialTransactionRequest,
  CreateFinancialTransactionSeriesRequest,
  FinancialTransaction,
  FinancialTransactionSeriesResponse,
  UpdateFinancialTransactionRequest,
  UpdateFinancialTransactionSeriesRequest,
} from "../dtos";

type PlanParams = { planId: string };
type TransactionParams = PlanParams & { id: string };
type SeriesParams = PlanParams & { seriesId: string };

const base = "*/plan/:planId/financial-transaction";

export const financialTransactionHandlers = {
  create(transaction: FinancialTransaction): HttpHandler {
    return http.post<
      PlanParams,
      CreateFinancialTransactionRequest["body"],
      FinancialTransaction
    >(base, () => HttpResponse.json(transaction, { status: 201 }));
  },
  createSeries(series: FinancialTransactionSeriesResponse): HttpHandler {
    return http.post<
      PlanParams,
      CreateFinancialTransactionSeriesRequest["body"],
      FinancialTransactionSeriesResponse
    >(`${base}/series`, () => HttpResponse.json(series, { status: 201 }));
  },
  update(transaction: FinancialTransaction): HttpHandler {
    return http.put<
      TransactionParams,
      UpdateFinancialTransactionRequest["body"],
      FinancialTransaction
    >(`${base}/:id`, () => HttpResponse.json(transaction));
  },
  createRejected(message: string): HttpHandler {
    return http.post<PlanParams>(base, () => HttpResponse.json({ message }, { status: 400 }));
  },
  updateSeries(series: FinancialTransactionSeriesResponse): HttpHandler {
    return http.put<
      SeriesParams,
      UpdateFinancialTransactionSeriesRequest["body"],
      FinancialTransactionSeriesResponse
    >(`${base}/series/:seriesId`, () => HttpResponse.json(series));
  },
};
