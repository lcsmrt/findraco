import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { checkParity } from "./translationParity.ts";

const source = {
  common: { cancel: "Cancel" },
  transactions: {
    greeting: "Hello {{name}}",
    count_one: "{{count}} line",
    count_other: "{{count}} lines",
  },
};

function without(key: string) {
  return Object.fromEntries(
    Object.entries(source.transactions).filter(([name]) => name !== key),
  );
}

describe("checkParity", () => {
  it("fails when the two languages differ", () => {
    const missingKey = { ...source, common: {} };
    expect(checkParity(source, missingKey)).toEqual([
      'pt-BR is missing "common.cancel" (present in en)',
    ]);

    const extraKey = {
      ...source,
      common: { cancel: "Cancelar", close: "Fechar" },
    };
    expect(checkParity(source, extraKey)).toEqual([
      'en is missing "common.close" (present in pt-BR)',
    ]);

    const otherVariable = {
      ...source,
      transactions: { ...source.transactions, greeting: "Olá {{nome}}" },
    };
    expect(checkParity(source, otherVariable)).toEqual([
      '"transactions.greeting" uses {{nome}} in pt-BR but {{name}} in en',
    ]);

    expect(
      checkParity(source, { ...source, transactions: without("count_one") }),
    ).toEqual([
      'pt-BR is missing "transactions.count_one" (present in en)',
      'plural "transactions.count" has the forms other in pt-BR but one, other in en',
    ]);

    const withoutOther = { ...source, transactions: without("count_other") };
    expect(checkParity(withoutOther, withoutOther)).toEqual([
      'en has plural "transactions.count" without its _other form',
      'pt-BR has plural "transactions.count" without its _other form',
    ]);
  });

  it("accepts languages with the same keys, variables and plural forms", () => {
    const translated = {
      common: { cancel: "Cancelar" },
      transactions: {
        greeting: "Olá {{name}}",
        count_one: "{{count}} linha",
        count_other: "{{count}} linhas",
      },
    };
    expect(checkParity(source, translated)).toEqual([]);
  });

  it("the committed language files are in parity", () => {
    function read(name: string) {
      return JSON.parse(
        readFileSync(
          new URL(`../src/i18n/${name}.json`, import.meta.url),
          "utf-8",
        ),
      );
    }
    expect(checkParity(read("en"), read("pt-BR"))).toEqual([]);
  });
});
