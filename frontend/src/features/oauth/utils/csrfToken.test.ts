import { describe, expect, it } from "vitest";
import { readCsrfToken } from "./csrfToken";

describe("readCsrfToken", () => {
  it("returns the raw value of the XSRF-TOKEN cookie among others", () => {
    expect(readCsrfToken("theme=dark; XSRF-TOKEN=a1b2-c3%3D; other=1")).toBe("a1b2-c3%3D");
  });

  it("returns an empty string when the cookie is absent", () => {
    expect(readCsrfToken("theme=dark; X-XSRF-TOKEN=nope")).toBe("");
  });
});
