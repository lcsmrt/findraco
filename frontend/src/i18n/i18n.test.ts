import { describe, expect, it } from "vitest";
import { i18n } from "./i18n";

describe("the unit test setup", () => {
  it("starts the tests in English", () => {
    expect(i18n.language).toBe("en");
    expect(i18n.t("common.cancel")).toBe("Cancel");
  });
});
