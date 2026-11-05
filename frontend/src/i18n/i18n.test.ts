import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { importResultMessage } from "@/api/utils/importResultMessage";
import { i18n } from "./i18n";

describe("the unit test setup", () => {
  it("starts the tests in English", () => {
    expect(i18n.language).toBe("en");
    expect(i18n.t("common.cancel")).toBe("Cancel");

    // Storybook runs the stories as tests: its preview must start in English too.
    const preview = readFileSync(join(process.cwd(), ".storybook/preview.tsx"), "utf-8");
    expect(preview).toContain('initI18n("en")');
    expect(preview).toContain('initialGlobals: { locale: "en" }');
  });
});

describe("counts in texts", () => {
  afterEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("uses the singular for one and the plural otherwise in both languages", async () => {
    const one = { imported: 1, skippedDuplicates: 0 };
    const many = { imported: 3, skippedDuplicates: 0 };

    expect(importResultMessage(one)).toBe("Imported 1 transaction.");
    expect(importResultMessage(many)).toBe("Imported 3 transactions.");

    await i18n.changeLanguage("pt-BR");

    expect(importResultMessage(one)).toBe("Importação concluída: 1 transação.");
    expect(importResultMessage(many)).toBe("Importação concluída: 3 transações.");
  });
});
