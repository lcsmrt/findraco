import { describe, expect, it } from "vitest";
import { i18n } from "../i18n";
import { translateMessage } from "./translateMessage";

describe("translateMessage", () => {
  it("translates a key and leaves any other text as it is", () => {
    expect(translateMessage(i18n.t, "common.cancel")).toBe("Cancel");
    expect(translateMessage(i18n.t, "Required")).toBe("Required");
  });
});
