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
