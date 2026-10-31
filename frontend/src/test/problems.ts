import { AxiosError, AxiosHeaders } from "axios";
import type { Problem, ProblemType } from "@/api/dtos";

/** A problem body as the API answers it. */
export function problemBody(status: number, type: ProblemType | string, extras: Partial<Problem> = {}): Problem {
  return { type: `urn:findraco:problem:${type}`, status, detail: "Developer detail, never shown.", ...extras };
}

/** The axios error a service call rejects with when the API answers this problem. */
export function problemError(status: number, type: ProblemType | string, extras: Partial<Problem> = {}) {
  return new AxiosError(`Request failed with status code ${status}`, String(status), undefined, undefined, {
    status,
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: problemBody(status, type, extras),
  });
}
