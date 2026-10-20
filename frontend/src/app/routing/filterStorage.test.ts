import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadFilters, saveFilters } from "./filterStorage";

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("filterStorage", () => {
  it("restores what was saved for the same screen, user and plan", () => {
    saveFilters("transactions", 1, 10, "plan=10&q=market");
    expect(loadFilters("transactions", 1, 10)).toBe("plan=10&q=market");
  });

  it("returns null when nothing is saved", () => {
    expect(loadFilters("overview", 1, 10)).toBeNull();
  });

  it("never returns another plan's state for the same user", () => {
    saveFilters("transactions", 1, 10, "plan=10&category=5");
    expect(loadFilters("transactions", 1, 11)).toBeNull();
  });

  it("never returns another user's state for the same plan", () => {
    saveFilters("transactions", 1, 10, "plan=10&category=5");
    expect(loadFilters("transactions", 2, 10)).toBeNull();
  });

  it("keeps each plan's state independent", () => {
    saveFilters("overview", 1, 10, "a");
    saveFilters("overview", 1, 11, "b");
    expect(loadFilters("overview", 1, 10)).toBe("a");
    expect(loadFilters("overview", 1, 11)).toBe("b");
  });

  it("saving for one screen leaves another screen's entry unchanged (NAV-06 AC 3)", () => {
    saveFilters("overview", 1, 10, "plan=10&period=last-3m");
    saveFilters("transactions", 1, 10, "plan=10&q=market");
    expect(loadFilters("overview", 1, 10)).toBe("plan=10&period=last-3m");
    expect(loadFilters("transactions", 1, 10)).toBe("plan=10&q=market");
    expect(loadFilters("categories", 1, 10)).toBeNull();
  });

  it("stores under the filters:{screen}:{userId}:{planId} key", () => {
    saveFilters("categories", 3, 4, "x");
    expect(localStorage.getItem("filters:categories:3:4")).toBe("x");
  });

  it("does not read an old homeFilters:{userId}:{planId} entry", () => {
    localStorage.setItem("homeFilters:1:10", "plan=10&tab=transactions&q=market");
    expect(loadFilters("overview", 1, 10)).toBeNull();
    expect(loadFilters("transactions", 1, 10)).toBeNull();
    expect(loadFilters("categories", 1, 10)).toBeNull();
  });

  it("save is a no-op when setItem throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => saveFilters("overview", 1, 10, "x")).not.toThrow();
  });

  it("load returns null when getItem throws", () => {
    saveFilters("overview", 1, 10, "x");
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(loadFilters("overview", 1, 10)).toBeNull();
  });
});
