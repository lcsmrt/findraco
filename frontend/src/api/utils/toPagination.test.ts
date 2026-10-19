import { describe, expect, it } from "vitest";
import type { PagedResponse } from "../dtos/paged";
import { toPagination } from "./toPagination";

function pageOf(overrides: Partial<PagedResponse<string>>): PagedResponse<string> {
  return {
    content: ["a"],
    page: 0,
    size: 10,
    totalElements: 25,
    totalPages: 3,
    last: false,
    ...overrides,
  };
}

describe("toPagination", () => {
  it("marks the first page as first and not last (STD-12 AC 2)", () => {
    expect(toPagination(pageOf({ page: 0 }))).toEqual({
      number: 0,
      size: 10,
      totalElements: 25,
      totalPages: 3,
      first: true,
      last: false,
    });
  });

  it("marks a middle page as neither first nor last (STD-12 AC 2)", () => {
    expect(toPagination(pageOf({ page: 1 }))).toEqual({
      number: 1,
      size: 10,
      totalElements: 25,
      totalPages: 3,
      first: false,
      last: false,
    });
  });

  it("marks the last page as last and not first (STD-12 AC 2)", () => {
    expect(toPagination(pageOf({ page: 2, last: true }))).toEqual({
      number: 2,
      size: 10,
      totalElements: 25,
      totalPages: 3,
      first: false,
      last: true,
    });
  });

  it("maps an empty result to a single first and last page (STD-12 AC 2)", () => {
    expect(
      toPagination(pageOf({ content: [], page: 0, totalElements: 0, totalPages: 0, last: true })),
    ).toEqual({
      number: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
    });
  });
});
