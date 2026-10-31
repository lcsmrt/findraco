import { describe, expect, it } from "vitest";
import {
  PASSWORD_CHARACTERS_MESSAGE,
  PASSWORD_LENGTH_MESSAGE,
  newPasswordSchema,
  passwordLength,
  passwordSpacesHint,
} from "./passwordSchema";

const schema = newPasswordSchema("Please enter a password");

function problems(password: string): string[] {
  const result = schema.safeParse(password);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe("newPasswordSchema", () => {
  it("refuses 7 characters and accepts 8 and 128", () => {
    expect(problems("a".repeat(7))).toEqual([PASSWORD_LENGTH_MESSAGE]);
    expect(problems("a".repeat(8))).toEqual([]);
    expect(problems("a".repeat(128))).toEqual([]);
  });

  it("refuses 129 characters", () => {
    expect(problems("a".repeat(129))).toEqual([PASSWORD_LENGTH_MESSAGE]);
  });

  it("counts an emoji as one character, not two", () => {
    expect(problems("😀".repeat(8))).toEqual([]);
    expect(problems("😀".repeat(7))).toEqual([PASSWORD_LENGTH_MESSAGE]);
    expect(problems("😀".repeat(128))).toEqual([]);
    expect(problems("😀".repeat(129))).toEqual([PASSWORD_LENGTH_MESSAGE]);
  });

  it.each([
    ["a zero-width space", "abc​defgh"],
    ["a tab", "abc\tdefgh"],
    ["a line feed", "abc\ndefgh"],
    ["a carriage return", "abc\rdefgh"],
    ["a line separator", "abc defgh"],
    ["a paragraph separator", "abc defgh"],
    ["a byte order mark", "abc﻿defgh"],
  ])("refuses %s", (_name, password) => {
    expect(problems(password)).toEqual([PASSWORD_CHARACTERS_MESSAGE]);
  });

  it("accepts accents, other scripts, punctuation and spaces", () => {
    expect(problems("correct horse battery staple")).toEqual([]);
    expect(problems("  espaços e acentuação  ")).toEqual([]);
    expect(problems("пароль-密码-パスワード-1234")).toEqual([]);
    expect(problems("p@ss.w0rd!")).toEqual([]);
  });

  it("reports both rules when both fail", () => {
    expect(problems("a\tb")).toEqual([PASSWORD_LENGTH_MESSAGE, PASSWORD_CHARACTERS_MESSAGE]);
  });

  it("counts after NFKC, like the API", () => {
    // "e" plus a combining accent is one character once normalised: 6 + 1 = 7.
    expect(problems("abcdef" + "é")).toEqual([PASSWORD_LENGTH_MESSAGE]);
    // Four "fi" ligatures expand to 8 letters.
    expect(problems("ﬁ".repeat(4))).toEqual([]);
    expect(passwordLength("ç")).toBe(passwordLength("ç"));
  });

  it("asks for a password when the field is empty, and only that", () => {
    expect(problems("")).toEqual(["Please enter a password"]);
  });
});

describe("passwordSpacesHint", () => {
  it("hints at a leading or trailing space without refusing it", () => {
    expect(passwordSpacesHint(" correct horse")).not.toBeNull();
    expect(passwordSpacesHint("correct horse ")).not.toBeNull();
    expect(problems(" correct horse ")).toEqual([]);
  });

  it("stays quiet for inner spaces and empty values", () => {
    expect(passwordSpacesHint("correct horse")).toBeNull();
    expect(passwordSpacesHint("")).toBeNull();
  });
});
