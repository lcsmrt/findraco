import { describe, expect, it } from "vitest";
import {
  MEMBER_PALETTE,
  NEUTRAL_MEMBER_COLOR,
  memberColor,
  memberColorIndex,
} from "./memberColors";

function members(...ids: number[]) {
  return ids.map((userId) => ({ userId }));
}

describe("memberColorIndex (UX-04 AC 2)", () => {
  it("orders members by user id, whatever the input order", () => {
    const sorted = members(3, 10, 42);
    const shuffled = members(42, 3, 10);

    for (const userId of [3, 10, 42]) {
      expect(memberColorIndex(shuffled, userId)).toBe(memberColorIndex(sorted, userId));
    }
    expect(memberColorIndex(shuffled, 3)).toBe(0);
    expect(memberColorIndex(shuffled, 10)).toBe(1);
    expect(memberColorIndex(shuffled, 42)).toBe(2);
  });

  it("wraps modulo the palette size", () => {
    const many = members(1, 2, 3, 4, 5, 6, 7, 8);

    expect(MEMBER_PALETTE).toHaveLength(6);
    expect(memberColorIndex(many, 7)).toBe(0);
    expect(memberColorIndex(many, 8)).toBe(1);
    expect(memberColor(many, 7)).toBe(MEMBER_PALETTE[0]);
  });

  it("gives an unknown user the neutral colour", () => {
    expect(memberColorIndex(members(1, 2), 99)).toBe(-1);
    expect(memberColor(members(1, 2), 99)).toBe(NEUTRAL_MEMBER_COLOR);
    expect(memberColor(members(5, 1), 5)).toBe(MEMBER_PALETTE[1]);
  });
});
