import { parseId } from "@/utils/searchParams";

export const PLAN_PARAM = "plan";

export function parsePlanParam(params: URLSearchParams): number | null {
  return parseId(params.get(PLAN_PARAM));
}
