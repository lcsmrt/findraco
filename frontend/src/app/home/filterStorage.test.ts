import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadHomeFilters, saveHomeFilters } from "./filterStorage";

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("filterStorage", () => {
  it("restores what was saved for the same user and plan", () => {
    saveHomeFilters(1, 10, "plan=10&tab=transactions");
    expect(loadHomeFilters(1, 10)).toBe("plan=10&tab=transactions");
  });

  it("returns null when nothing is saved", () => {
    expect(loadHomeFilters(1, 10)).toBeNull();
  });

  it("never returns another plan's state for the same user", () => {
    saveHomeFilters(1, 10, "plan=10&category=5");
    expect(loadHomeFilters(1, 11)).toBeNull();
  });

  it("never returns another user's state for the same plan", () => {
    saveHomeFilters(1, 10, "plan=10&category=5");
    expect(loadHomeFilters(2, 10)).toBeNull();
  });

  it("keeps each plan's state independent", () => {
    saveHomeFilters(1, 10, "a");
    saveHomeFilters(1, 11, "b");
    expect(loadHomeFilters(1, 10)).toBe("a");
    expect(loadHomeFilters(1, 11)).toBe("b");
  });

  it("stores under the homeFilters:{userId}:{planId} key", () => {
    saveHomeFilters(3, 4, "x");
    expect(localStorage.getItem("homeFilters:3:4")).toBe("x");
  });

  it("save is a no-op when setItem throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => saveHomeFilters(1, 10, "x")).not.toThrow();
  });

  it("load returns null when getItem throws", () => {
    saveHomeFilters(1, 10, "x");
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(loadHomeFilters(1, 10)).toBeNull();
  });
});
