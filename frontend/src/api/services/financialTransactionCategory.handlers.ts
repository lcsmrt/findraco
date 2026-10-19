import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  CategorySpending,
  CategoryUsage,
  CreateFinancialTransactionCategoryRequest,
  FinancialTransactionCategory,
  PagedResponse,
  UpdateFinancialTransactionCategoryRequest,
} from "../dtos";

type PlanParams = { planId: string };
type CategoryParams = PlanParams & { id: string };

const base = "*/plan/:planId/financial-transaction-category";

export const financialTransactionCategoryHandlers = {
  list(page: PagedResponse<FinancialTransactionCategory>): HttpHandler {
    return http.get<PlanParams, never, PagedResponse<FinancialTransactionCategory>>(base, () =>
      HttpResponse.json(page),
    );
  },
  get(category: FinancialTransactionCategory): HttpHandler {
    return http.get<CategoryParams, never, FinancialTransactionCategory>(`${base}/:id`, () =>
      HttpResponse.json(category),
    );
  },
  getNotFound(): HttpHandler {
    return http.get<CategoryParams>(`${base}/:id`, () =>
      HttpResponse.json({ title: "Category not found" }, { status: 404 }),
    );
  },
  getServerError(): HttpHandler {
    return http.get<CategoryParams>(`${base}/:id`, () =>
      HttpResponse.json({ title: "Internal server error" }, { status: 500 }),
    );
  },
  getNetworkError(): HttpHandler {
    return http.get<CategoryParams>(`${base}/:id`, () => HttpResponse.error());
  },
  spending(tree: CategorySpending[]): HttpHandler {
    return http.get<PlanParams, never, CategorySpending[]>(`${base}/spending`, () =>
      HttpResponse.json(tree),
    );
  },
  usage(usage: CategoryUsage): HttpHandler {
    return http.get<CategoryParams, never, CategoryUsage>(`${base}/:id/usage`, () =>
      HttpResponse.json(usage),
    );
  },
  create(category: FinancialTransactionCategory): HttpHandler {
    return http.post<
      PlanParams,
      CreateFinancialTransactionCategoryRequest["body"],
      FinancialTransactionCategory
    >(base, () => HttpResponse.json(category, { status: 201 }));
  },
  createRejected(message: string): HttpHandler {
    return http.post<PlanParams>(base, () => HttpResponse.json({ message }, { status: 400 }));
  },
  update(category: FinancialTransactionCategory): HttpHandler {
    return http.put<
      CategoryParams,
      UpdateFinancialTransactionCategoryRequest["body"],
      FinancialTransactionCategory
    >(`${base}/:id`, () => HttpResponse.json(category));
  },
  delete(): HttpHandler {
    return http.delete<CategoryParams>(`${base}/:id`, () => new HttpResponse(null, { status: 204 }));
  },
};
