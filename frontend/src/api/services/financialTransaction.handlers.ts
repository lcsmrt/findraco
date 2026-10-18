import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  CreateFinancialTransactionRequest,
  FinancialTransaction,
  UpdateFinancialTransactionRequest,
} from "../dtos";

type PlanParams = { planId: string };
type TransactionParams = PlanParams & { id: string };

const base = "*/plan/:planId/financial-transaction";

export const financialTransactionHandlers = {
  create(transaction: FinancialTransaction): HttpHandler {
    return http.post<PlanParams, CreateFinancialTransactionRequest["body"], FinancialTransaction>(
      base,
      () => HttpResponse.json(transaction, { status: 201 }),
    );
  },
  update(transaction: FinancialTransaction): HttpHandler {
    return http.put<TransactionParams, UpdateFinancialTransactionRequest["body"], FinancialTransaction>(
      `${base}/:id`,
      () => HttpResponse.json(transaction),
    );
  },
};
