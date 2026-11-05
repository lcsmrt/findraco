import { stubScreenWidth } from "@/test/screenWidth";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useIsNarrowScreen } from "./useIsNarrowScreen";

describe("useIsNarrowScreen", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("reports 639px as narrow and 640px as wide", () => {
    const screen = stubScreenWidth(639);
    const { result } = renderHook(() => useIsNarrowScreen());
    expect(result.current).toBe(true);

    act(() => screen.setWidth(640));
    expect(result.current).toBe(false);

    act(() => screen.setWidth(639));
    expect(result.current).toBe(true);
  });
});
