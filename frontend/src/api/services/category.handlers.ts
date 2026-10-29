import { http, HttpResponse, type HttpHandler } from "msw";
import type {
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
  create(category: Category): HttpHandler {
    return http.post<
      PlanParams,
      CreateCategoryRequest["body"],
      Category
    >(base, () => HttpResponse.json(category, { status: 201 }));
  },
  createRejected(message: string): HttpHandler {
    return http.post<PlanParams>(base, () => HttpResponse.json({ message }, { status: 400 }));
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
};
