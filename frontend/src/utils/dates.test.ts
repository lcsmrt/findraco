import { afterEach, describe, expect, it } from "vitest";
import { i18n } from "@/i18n/i18n";
import { stubDeviceLanguage } from "@/test/deviceLanguage";
import {
  datePlaceholder,
  formatDate,
  formatDateTime,
  formatMonthYear,
  formatPattern,
  parseDate,
  toIsoDate,
} from "./dates";

const NOVEMBER_4 = new Date(2026, 10, 4);

afterEach(async () => {
  await i18n.changeLanguage("en");
});

describe("formatDate", () => {
  it("writes 04/11/2026 in Portuguese", async () => {
    await i18n.changeLanguage("pt-BR");
    stubDeviceLanguage("en-US");

    expect(formatDate(NOVEMBER_4)).toBe("04/11/2026");
  });

  it("writes 04/11/2026 in English on a Brazilian device", () => {
    stubDeviceLanguage("pt-BR");

    expect(formatDate(NOVEMBER_4)).toBe("04/11/2026");
  });

  it("writes 11/04/2026 in English on a US device", () => {
    stubDeviceLanguage("en-US");

    expect(formatDate(NOVEMBER_4)).toBe("11/04/2026");
  });

  it("reads a stored date by its calendar day, ignoring the time and the time zone", () => {
    expect(formatDate("2026-10-31T23:30:00.000Z")).toBe("31/10/2026");
  });
});

describe("formatPattern", () => {
  it("names months and weekdays in Portuguese", async () => {
    await i18n.changeLanguage("pt-BR");

    expect(formatPattern(NOVEMBER_4, "MMMM")).toBe("novembro");
    expect(formatPattern(NOVEMBER_4, "EEEE")).toBe("quarta-feira");
  });

  it("names months and weekdays in English", () => {
    expect(formatPattern(NOVEMBER_4, "MMMM yyyy")).toBe("November 2026");
    expect(formatPattern("2026-10-01", "EEE, d MMM yyyy")).toBe(
      "Thu, 1 Oct 2026",
    );
  });
});

describe("the other numeric layouts", () => {
  it("follows the device region for the time and the month", () => {
    const moment = new Date(2026, 10, 4, 14, 5);

    expect(formatDateTime(moment)).toBe("04/11/2026 14:05");
    expect(formatMonthYear(moment)).toBe("11/2026");
    stubDeviceLanguage("en-US");
    expect(formatDateTime(moment)).toBe("11/04/2026 14:05");
  });

  it("hints and reads dates in the layout it writes", () => {
    expect(datePlaceholder()).toBe("dd/mm/yyyy");
    expect(parseDate("04/11/2026")).toEqual(NOVEMBER_4);
    stubDeviceLanguage("en-US");
    expect(datePlaceholder()).toBe("mm/dd/yyyy");
    expect(parseDate("11/04/2026")).toEqual(NOVEMBER_4);
  });
});

describe("typed dates with a fixed layout", () => {
  // The Nubank file is read by the API (day first, whatever the viewer's language); the app never
  // parses it. This guards the layout helper such a reader would use against following the language.
  it("reads CSV dates as dd/mm/yyyy in both languages", async () => {
    expect(parseDate("04/11/2026", "dd/MM/yyyy")).toEqual(NOVEMBER_4);
    await i18n.changeLanguage("pt-BR");
    stubDeviceLanguage("en-US");
    expect(parseDate("04/11/2026", "dd/MM/yyyy")).toEqual(NOVEMBER_4);
  });
});

describe("toIsoDate", () => {
  it("writes the API's yyyy-MM-dd in every language", async () => {
    expect(toIsoDate(NOVEMBER_4)).toBe("2026-11-04");
    await i18n.changeLanguage("pt-BR");
    expect(toIsoDate(NOVEMBER_4)).toBe("2026-11-04");
  });
});
