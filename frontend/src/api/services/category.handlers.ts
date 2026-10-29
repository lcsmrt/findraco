import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  Problem,
  ProblemType,
  CategorySpending,
  CategoryUsage,
  CreateCategoryRequest,
  Category,
  PagedResponse,
  UpdateCategoryRequest,
} from "../dtos";

type PlanParams = { planId: string };
type CategoryParams = PlanParams & { id: string };

const base = "*/plan/:planId/category";

export const categoryHandlers = {
  list(page: PagedResponse<Category>): HttpHandler {
    return http.get<PlanParams, never, PagedResponse<Category>>(base, () =>
      HttpResponse.json(page),
    );
  },
  get(category: Category): HttpHandler {
    return http.get<CategoryParams, never, Category>(`${base}/:id`, () =>
      HttpResponse.json(category),
    );
  },
  getNotFound(): HttpHandler {
    return http.get<CategoryParams, never, Problem>(`${base}/:id`, () =>
      HttpResponse.json({ type: "urn:findraco:problem:category-not-found", status: 404 }, { status: 404 }),
    );
  },
  getServerError(): HttpHandler {
    return http.get<CategoryParams, never, Problem>(`${base}/:id`, () =>
      HttpResponse.json({ type: "urn:findraco:problem:internal", status: 500 }, { status: 500 }),
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
  create(category: Category): HttpHandler {
    return http.post<
      PlanParams,
      CreateCategoryRequest["body"],
      Category
    >(base, () => HttpResponse.json(category, { status: 201 }));
  },
  createRejected(status: number, type: ProblemType): HttpHandler {
    return http.post<PlanParams, CreateCategoryRequest["body"], Problem>(base, () =>
      HttpResponse.json({ type: `urn:findraco:problem:${type}`, status }, { status }),
    );
  },
  update(category: Category): HttpHandler {
    return http.put<
      CategoryParams,
      UpdateCategoryRequest["body"],
      Category
    >(`${base}/:id`, () => HttpResponse.json(category));
  },
  delete(): HttpHandler {
    return http.delete<CategoryParams>(`${base}/:id`, () => new HttpResponse(null, { status: 204 }));
  },
  /** The category changed since the dialog loaded: a 409 the dialog tells apart by `type`. */
  deleteConflict(type: ProblemType): HttpHandler {
    return http.delete<CategoryParams, never, Problem>(`${base}/:id`, () =>
      HttpResponse.json({ type: `urn:findraco:problem:${type}`, status: 409, requestId: "req-delete" }, { status: 409 }),
    );
  },
};
