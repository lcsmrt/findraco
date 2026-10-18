---
name: api-integration
description: Create or change frontend data access in findraco: axios (`findracoApi`) + TanStack Query wrapped in service hooks. Covers DTO and request types and their naming, plan-scoped service hooks (raw function + `useXxx` hook), query keys, mutations with `buildMutationOptions` toasts, cache invalidation, paged queries (`buildPagedQuery`, `toPagination`), and the typed MSW handler factories (`xxx.handlers.ts`) that every service ships with for tests. Use when adding or changing an endpoint hook, a DTO, a query or mutation, cache invalidation, or the handlers that simulate an endpoint. Triggers on "api integration", "service hook", "useQuery", "useMutation", "TanStack Query", "DTO", "fetch data", "invalidate query", "paginated endpoint", "pagination", "msw handler", "handlers.ts", "mock the api".
metadata:
  type: reference
---

# API Integration

Data access uses **axios** + **TanStack Query**, wrapped in service hooks. Components never call the
HTTP client; they call a service hook. Code style (`function` declarations, `type`) follows
`component-creation`.

---

## File locations

| Thing | Location |
| --- | --- |
| HTTP client (interceptors, session refresh) | `src/api/clients/findracoApi.ts` |
| DTOs and request types | `src/api/dtos/<entity>.ts`, re-exported from `src/api/dtos/index.ts` |
| Service hooks | `src/api/services/useXxxService.ts`, one file per domain |
| Handler factories (tests only) | `src/api/services/xxx.handlers.ts`, beside the service |
| `QueryOptions`, `MutationOptions` | `src/api/types/` |
| `buildMutationOptions`, `buildPagedQuery`, `toPagination` | `src/api/utils/` |

Service hooks live in `src/api/services/`, never inside a feature.

---

## DTOs and naming

```ts
// dtos/product.ts
export type ProductStatus = "ACTIVE" | "ARCHIVED";

export type Product = {
  id: number;
  name: string;
  price: number;
  status: ProductStatus;
  category?: Category;
};

export type CreateProductRequest = {
  body: {
    name: string;
    price: number;
    status: ProductStatus;
    categoryId: number | null;
  };
};

export type UpdateProductRequest = {
  params: { id: number };
  body: CreateProductRequest["body"];
};

export type ProductSortBy = "name" | "price" | "status";

export type PagedProductsFilter = {
  status?: ProductStatus;
  name?: string;
};
```

- `type` only, never `interface` (lint `@typescript-eslint/consistent-type-definitions`).
- Entities: plain PascalCase (`FinancialTransaction`).
- Call shapes: `CreateXxxRequest` / `UpdateXxxRequest` / `DeleteXxxRequest`, holding `params` and/or
  `body`.
- `XxxResponse`: the API wire shape when it differs from the entity (`DashboardSummaryResponse`). Keep it
  in the service layer; screens use the entity or the response type the hook returns.
- Paged endpoints use the shared `PagedRequest<TFilter, TSortBy>` and `PagedResponse<T>`.
- A DTO describes JSON: dates arrive as ISO strings. Converting them to `Date` is a form mapper's job
  (`form-creation`).

---

## Query hooks

```ts
import { useQuery } from "@tanstack/react-query";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { findracoApi } from "../clients/findracoApi";
import { DashboardFilter, MonthlyTrend } from "../dtos";
import { QueryOptions } from "../types/queryOptions";

// 1. Raw async function: HTTP only, no hooks
async function getDashboardTrend(planId: number, params: DashboardFilter): Promise<MonthlyTrend[]> {
  const { data } = await findracoApi.get<MonthlyTrend[]>(`/plan/${planId}/dashboard/trend`, { params });
  return data;
}

// 2. Hook: wraps the function, scopes it to the active plan, accepts options
export function useGetDashboardTrend(params: DashboardFilter, options?: QueryOptions<MonthlyTrend[]>) {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getDashboardTrend(activePlanId!, params),
    queryKey: ["dashboardTrend", activePlanId, params],
    ...options,
    enabled: activePlanId != null && (options?.enabled ?? true),
  });
}
```

**Plan scoping.** A plan-scoped endpoint takes the plan as a path variable (`/plan/{planId}/…`), read
from `usePlanContext()`. The active plan goes into the query key and `enabled` waits for it. Why: the
cache never serves one plan's data to another, and switching plans refetches. The `!` in `queryFn` is
safe only because of that `enabled` guard; keep them together.

**Query keys**

- Always an array: `["entityName", activePlanId, params]` for plan-scoped lists, `["entity", id]` for one
  item.
- Include every value the query depends on; TanStack Query compares deeply.

**Conditional queries** use `enabled`, never `useEffect`.

---

## Mutation hooks

```ts
async function createProduct(payload: CreateProductRequest): Promise<Product> {
  const { data } = await findracoApi.post<Product>("/product", payload.body);
  return data;
}

export function useCreateProduct(options?: MutationOptions<Product, CreateProductRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    ...buildMutationOptions(
      { successMessage: "Product created successfully." },
      {
        ...options,
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries({ queryKey: ["products"] });
          options?.onSuccess?.(data, variables);
        },
      },
    ),
  });
}
```

- `buildMutationOptions(defaults, options)` wires the success and error toasts. Service-level defaults go
  in the first argument; callers override through `options` (`successMessage`, `errorMessage`,
  `showSuccessToast`, `showErrorToast`, `onSuccess`, `onError`).
- A mutation that changes list data invalidates the related queries in `onSuccess`, then calls the
  caller's `onSuccess`.
- A failed session renewal already shows its own message, so `buildMutationOptions` skips the error toast
  for `SessionExpiredError`; do not add another.

---

## Paged queries: `buildPagedQuery` and `toPagination`

- `buildPagedQuery(params)` turns a `PagedRequest` into a query string, skipping `undefined`, `null` and
  `""`:
  `{ page: 0, size: 10, filter: { status: "ACTIVE" }, sort: { by: "name", direction: "desc" } }` →
  `"page=0&size=10&status=ACTIVE&sortBy=name&sortDirection=desc"`.
- `toPagination(page)` (beside it, its inverse) turns a `PagedResponse` into the table's pagination
  props. Never map `page`, `size`, `totalElements` and `totalPages` to the table by hand in a screen.

---

## Handler factories: `xxx.handlers.ts`

Every service file has a sibling `xxx.handlers.ts` with one factory per endpoint. A factory takes the
response the test needs and returns an MSW `HttpHandler`. Tests compose them; the rules for
using them (no global handlers, scenarios, unhandled requests fail) are in `frontend-testing`.

```ts
// src/api/services/dashboard.handlers.ts
import { http, HttpResponse, type HttpHandler } from "msw";
import type { DashboardSummaryResponse, MonthlyTrend } from "../dtos";

type PlanParams = { planId: string };

export const dashboardHandlers = {
  summary(summary: DashboardSummaryResponse): HttpHandler {
    return http.get<PlanParams, never, DashboardSummaryResponse>("*/plan/:planId/dashboard", () =>
      HttpResponse.json(summary),
    );
  },
  trend(trend: MonthlyTrend[]): HttpHandler {
    return http.get<PlanParams, never, MonthlyTrend[]>("*/plan/:planId/dashboard/trend", () =>
      HttpResponse.json(trend),
    );
  },
};
```

```ts
// in a test
server.use(dashboardHandlers.trend(trend));
```

- **Typed through MSW's generics** (`http.get<Params, RequestBody, ResponseBody>`) with the DTOs from
  `src/api/dtos/`. Why: a handler that drifts from the DTO fails to compile instead of passing tests
  against a shape the API never returns.
- Name the export `<domain>Handlers` and each factory after its endpoint (`summary`, `trend`).
- Add or update the factory in the same change as the service function it mirrors. A response a test
  needs that the factory cannot express (an error status) gets its own factory.
- Factories hold no logic: they return what they are given. That is why `*.handlers.ts` files are exempt
  from the sibling-test gate (by suffix in `scripts/check-siblings.ts`) and excluded from coverage; every
  test that uses them exercises them.
- **Only tests import `*.handlers` or `@/test/*`.** Enforced by lint `no-restricted-imports` on every
  non-test file, stories included. Why: without it, the gate exemption by suffix would become a hiding
  place for application code; and stories render presentational components from props, so they never
  need the network.

---

## Testing a service hook

A service hook is tested through MSW with the real `findracoApi`, asserting what reaches the network
(method, URL, params, body) and how the response is mapped. The rules and helpers are in
`frontend-testing`.
