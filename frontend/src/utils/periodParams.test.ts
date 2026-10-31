import { describe, expect, it } from "vitest";
import { PERIODS } from "./period";
import {
  parsePeriodParams,
  resolveSelection,
  serializePeriodParams,
  type PeriodSelection,
} from "./periodParams";

function params(init: Record<string, string>) {
  return new URLSearchParams(init);
}

const DEFAULT_SELECTION: PeriodSelection = { period: "this-month", customRange: null };

describe("period codec", () => {
  it.each(PERIODS)("round-trips the %s preset (PNAV-01)", (period) => {
    const selection: PeriodSelection = { period, customRange: null };
    expect(parsePeriodParams(params(serializePeriodParams(selection)))).toEqual(selection);
  });

  it("round-trips a custom range (PNAV-01)", () => {
    const selection: PeriodSelection = {
      period: "this-month",
      customRange: { from: "2026-09-01", to: "2026-09-30" },
    };
    const serialized = serializePeriodParams(selection);
    expect(serialized).toEqual({
      period: "custom",
      periodFrom: "2026-09-01",
      periodTo: "2026-09-30",
    });
    expect(parsePeriodParams(params(serialized))).toEqual(selection);
  });

  it("serializes the default preset to nothing (PNAV-03)", () => {
    expect(serializePeriodParams(DEFAULT_SELECTION)).toEqual({});
  });

  it("opens on This month when no param is set (PNAV-05)", () => {
    expect(parsePeriodParams(params({}))).toEqual(DEFAULT_SELECTION);
  });

  it("falls back to This month for an unknown token (PNAV-05)", () => {
    expect(parsePeriodParams(params({ period: "last-decade" }))).toEqual(DEFAULT_SELECTION);
  });

  it("falls back to This month when the custom start is after its end (PNAV-05)", () => {
    expect(
      parsePeriodParams(params({ period: "custom", periodFrom: "2026-09-30", periodTo: "2026-09-01" })),
    ).toEqual(DEFAULT_SELECTION);
  });

  it("falls back to This month when a custom date is unparsable (PNAV-05)", () => {
    expect(
      parsePeriodParams(params({ period: "custom", periodFrom: "2026-13-45", periodTo: "2026-09-01" })),
    ).toEqual(DEFAULT_SELECTION);
  });

  it.each([["periodFrom"], ["periodTo"]])("falls back to This month when only %s is set (PNAV-05)", (key) => {
    expect(parsePeriodParams(params({ period: "custom", [key]: "2026-09-01" }))).toEqual(DEFAULT_SELECTION);
  });

  it("ignores custom dates when the period is a preset", () => {
    expect(
      parsePeriodParams(params({ period: "last-3m", periodFrom: "2026-09-01", periodTo: "2026-09-30" })),
    ).toEqual({ period: "last-3m", customRange: null });
  });
});

describe("resolveSelection", () => {
  it("returns a custom range as is (PNAV-01)", () => {
    const selection: PeriodSelection = {
      period: "this-month",
      customRange: { from: "2026-09-05", to: "2026-09-20" },
    };
    expect(resolveSelection(selection, new Date(2026, 10, 3))).toEqual({
      startDate: "2026-09-05",
      endDate: "2026-09-20",
    });
  });

  it("resolves a preset against now, so a saved This month follows the calendar (PNAV-03)", () => {
    expect(resolveSelection(DEFAULT_SELECTION, new Date(2026, 10, 3))).toEqual({
      startDate: "2026-11-01",
      endDate: "2026-11-30",
    });
  });
});
