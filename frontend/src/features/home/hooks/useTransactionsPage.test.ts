import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { TransactionFilters } from "@/features/transactions/filters/transactionParams";
import { useTransactionsPage } from "./useTransactionsPage";

const base: TransactionFilters = {
  filter: { categoryId: 12 },
  sort: null,
  size: 10,
};

const setup = () => {
  const hook = renderHook((filters: TransactionFilters) => useTransactionsPage(filters), {
    initialProps: base,
  });
  act(() => hook.result.current[1](3));
  return hook;
};

describe("useTransactionsPage", () => {
  it("starts on the first page", () => {
    const { result } = renderHook(() => useTransactionsPage(base));
    expect(result.current[0]).toBe(0);
  });

  it("keeps the chosen page while filters, sort and size are unchanged", () => {
    const { result, rerender } = setup();
    expect(result.current[0]).toBe(3);

    rerender({ ...base, filter: { categoryId: 12 } });
    expect(result.current[0]).toBe(3);
  });

  it.each<[string, TransactionFilters]>([
    ["a filter", { ...base, filter: { categoryId: 12, type: "DEBIT" } }],
    ["the sort", { ...base, sort: { by: "amount", direction: "desc" } }],
    ["the page size", { ...base, size: 25 }],
    ["a clear", { ...base, filter: {} }],
  ])("resets to the first page when %s changes", (_, next) => {
    const { result, rerender } = setup();

    rerender(next);
    expect(result.current[0]).toBe(0);
  });
});
