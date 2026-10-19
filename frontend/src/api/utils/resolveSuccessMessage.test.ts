import { describe, expect, it } from "vitest";
import { resolveSuccessMessage } from "./resolveSuccessMessage";

describe("resolveSuccessMessage", () => {
  it("builds the message from the response data and request variables", () => {
    const message = resolveSuccessMessage({
      message: (data: { count: number }, variables: { name: string }) => `${data.count} ${variables.name}`,
      data: { count: 3 },
      variables: { name: "imported" },
      fallbackMessage: "Done.",
    });

    expect(message).toBe("3 imported");
  });

  it("returns a static message as given", () => {
    expect(resolveSuccessMessage({ message: "Saved.", data: null, variables: null, fallbackMessage: "Done." })).toBe(
      "Saved.",
    );
  });

  it("returns the fallback without a message", () => {
    expect(resolveSuccessMessage({ data: null, variables: null, fallbackMessage: "Done." })).toBe("Done.");
  });

  it("returns an empty message without a message or a fallback", () => {
    expect(resolveSuccessMessage({ data: null, variables: null })).toBe("");
  });
});
