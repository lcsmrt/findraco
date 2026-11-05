import { createInstance } from "i18next";
import { describe, expect, it } from "vitest";
import { syncDocumentLanguage } from "./syncDocumentLanguage";

describe("syncDocumentLanguage", () => {
  it("sets the document lang to the language in use", async () => {
    const instance = createInstance();
    await instance.init({
      lng: "en",
      resources: { en: { translation: {} }, "pt-BR": { translation: {} } },
    });
    const root = document.createElement("html");

    syncDocumentLanguage(instance, root);
    expect(root.lang).toBe("en");

    await instance.changeLanguage("pt-BR");
    expect(root.lang).toBe("pt-BR");
  });
});
