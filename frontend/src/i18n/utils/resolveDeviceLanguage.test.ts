import { describe, expect, it } from "vitest";
import { resolveDeviceLanguage } from "./resolveDeviceLanguage";

describe("resolveDeviceLanguage", () => {
  it("picks pt-BR for a Portuguese device language and en otherwise", () => {
    expect(resolveDeviceLanguage(["pt-BR"])).toBe("pt-BR");
    expect(resolveDeviceLanguage(["pt"])).toBe("pt-BR");
    expect(resolveDeviceLanguage(["pt-PT"])).toBe("pt-BR");
    expect(resolveDeviceLanguage(["en-US", "pt-BR"])).toBe("pt-BR");
    expect(resolveDeviceLanguage(["en-US", "fr"])).toBe("en");
    expect(resolveDeviceLanguage(["ptolemaic"])).toBe("en");
    expect(resolveDeviceLanguage([])).toBe("en");
  });
});
