import { parseId } from "@/utils/searchParams";

export type HomeTab = "overview" | "transactions" | "categories";

export const DEFAULT_TAB: HomeTab = "overview";

export const PLAN_PARAM = "plan";
export const TAB_PARAM = "tab";

const TABS: readonly HomeTab[] = ["overview", "transactions", "categories"];

export function parsePlanParam(params: URLSearchParams): number | null {
  return parseId(params.get(PLAN_PARAM));
}

export function parseTab(params: URLSearchParams): HomeTab {
  return TABS.find((t) => t === params.get(TAB_PARAM)) ?? DEFAULT_TAB;
}

export function serializeTab(tab: HomeTab): Record<string, string> {
  return tab === DEFAULT_TAB ? {} : { [TAB_PARAM]: tab };
}
