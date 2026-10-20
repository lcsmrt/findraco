import { describe, expect, it } from "vitest";
import { readReturnLocation } from "./returnLocation";

describe("readReturnLocation", () => {
  it("returns the path and query string a guarded route stored", () => {
    const state = { from: { pathname: "/plans", search: "?x=1", hash: "", key: "k1", state: null } };

    expect(readReturnLocation(state)).toEqual({ pathname: "/plans", search: "?x=1" });
  });

  it.each([
    ["no state", null],
    ["a non-string pathname", { from: { pathname: 42, search: "" } }],
  ])("returns nothing for %s", (_, state) => {
    expect(readReturnLocation(state)).toBeUndefined();
  });
});
