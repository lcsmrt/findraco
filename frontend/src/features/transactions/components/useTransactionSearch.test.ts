import { act } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { useTransactionFilters } from "../filters/useTransactionFilters";
import { useTransactionSearch } from "./useTransactionSearch";

function setup(route: string) {
  return renderHookWithProviders(
    () => ({
      ...useTransactionSearch(),
      clearTransactions: useTransactionFilters().clearTransactions,
      location: useLocation(),
    }),
    { route },
  );
}

function q(search: string) {
  return new URLSearchParams(search).get("q");
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useTransactionSearch (STD-12 AC 1)", () => {
  it("starts the draft from the URL's q", () => {
    const { result } = setup("/?q=rent");

    expect(result.current.search).toBe("rent");
  });

  it("starts empty without q", () => {
    const { result } = setup("/");

    expect(result.current.search).toBe("");
  });

  it("keeps the URL unchanged while typing has not settled", () => {
    const { result } = setup("/?q=rent");

    act(() => result.current.setSearch("groceries"));
    act(() => vi.advanceTimersByTime(399));

    expect(result.current.search).toBe("groceries");
    expect(q(result.current.location.search)).toBe("rent");
  });

  it("writes the draft to q once typing settles for 400 ms", () => {
    const { result } = setup("/?q=rent");

    act(() => result.current.setSearch("gro"));
    act(() => vi.advanceTimersByTime(200));
    act(() => result.current.setSearch("groceries"));
    act(() => vi.advanceTimersByTime(399));
    expect(q(result.current.location.search)).toBe("rent");

    act(() => vi.advanceTimersByTime(1));
    expect(q(result.current.location.search)).toBe("groceries");
  });

  it("keeps the other params when it writes q", () => {
    const { result } = setup("/?plan=1&type=DEBIT");

    act(() => result.current.setSearch("rent"));
    act(() => vi.advanceTimersByTime(400));

    const params = new URLSearchParams(result.current.location.search);
    expect(params.get("q")).toBe("rent");
    expect(params.get("type")).toBe("DEBIT");
    expect(params.get("plan")).toBe("1");
  });

  it("empties the draft at once on clear and removes q once settled", () => {
    const { result } = setup("/?q=rent");

    act(() => result.current.clearSearch());
    expect(result.current.search).toBe("");
    expect(q(result.current.location.search)).toBe("rent");

    act(() => vi.advanceTimersByTime(400));
    expect(q(result.current.location.search)).toBeNull();
  });

  it("never writes the old search back when the filters are cleared together with it", () => {
    const { result } = setup("/?q=rent&type=DEBIT");

    act(() => {
      result.current.clearSearch();
      result.current.clearTransactions();
    });
    expect(q(result.current.location.search)).toBeNull();
    act(() => vi.advanceTimersByTime(400));

    const params = new URLSearchParams(result.current.location.search);
    expect(params.get("q")).toBeNull();
    expect(params.get("type")).toBeNull();
    expect(result.current.search).toBe("");
  });
});
