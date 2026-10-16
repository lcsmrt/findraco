import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAccessToken, setAccessToken } from "./accessToken";

beforeEach(() => {
  setAccessToken(null);
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("accessToken store", () => {
  it("returns the token that was set and null once it is cleared", () => {
    expect(getAccessToken()).toBeNull();

    setAccessToken("jwt-1");
    expect(getAccessToken()).toBe("jwt-1");

    setAccessToken("jwt-2");
    expect(getAccessToken()).toBe("jwt-2");

    setAccessToken(null);
    expect(getAccessToken()).toBeNull();
  });

  it("writes nothing to localStorage or sessionStorage", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    setAccessToken("jwt-1");

    expect(setItemSpy).not.toHaveBeenCalled();
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });
});
