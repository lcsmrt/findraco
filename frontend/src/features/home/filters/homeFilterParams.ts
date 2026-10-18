import { parseId } from "@/utils/searchParams";

export type HomeTab = "overview" | "transactions" | "categories";

export const DEFAULT_TAB: HomeTab = "overview";

export const PLAN_PARAM = "plan";
export const TAB_PARAM = "tab";

const TABS: readonly HomeTab[] = ["overview", "transactions", "categories"];

export const parsePlanParam = (params: URLSearchParams): number | null =>
  parseId(params.get(PLAN_PARAM));

export const parseTab = (params: URLSearchParams): HomeTab =>
  TABS.find((t) => t === params.get(TAB_PARAM)) ?? DEFAULT_TAB;

export const serializeTab = (tab: HomeTab): Record<string, string> =>
  tab === DEFAULT_TAB ? {} : { [TAB_PARAM]: tab };
