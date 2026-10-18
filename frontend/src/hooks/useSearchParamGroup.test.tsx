import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { useSearchParamGroup } from "./useSearchParamGroup";

type Range = { from: string | null; to: string | null };

const RANGE_KEYS = ["from", "to"] as const;

function parseRange(params: URLSearchParams): Range {
  return { from: params.get("from"), to: params.get("to") };
}

function serializeRange(range: Range): Record<string, string> {
  const out: Record<string, string> = {};
  if (range.from) out.from = range.from;
  if (range.to) out.to = range.to;
  return out;
}

/** Renders the hook at `initial`, with `/other` as the previous history entry. */
function setup(initial: string) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={["/other", initial]} initialIndex={1}>
        {children}
      </MemoryRouter>
    );
  }
  return renderHook(
    () => ({
      group: useSearchParamGroup(RANGE_KEYS, parseRange, serializeRange),
      location: useLocation(),
      navigate: useNavigate(),
    }),
    { wrapper: Wrapper },
  );
}

type Rendered = ReturnType<typeof setup>;

function currentParams({ result }: Rendered) {
  return Object.fromEntries(new URLSearchParams(result.current.location.search));
}

async function goBack({ result }: Rendered) {
  await act(async () => result.current.navigate(-1));
}

describe("useSearchParamGroup", () => {
  it("parses the group's value from the URL", () => {
    const rendered = setup("/?from=2026-10-01&to=2026-10-31&plan=1");

    expect(rendered.result.current.group.value).toEqual({
      from: "2026-10-01",
      to: "2026-10-31",
    });
  });

  it("writes an update to the URL without adding a history entry, leaving foreign keys untouched", async () => {
    const rendered = setup("/?plan=1&from=2026-10-01&tab=transactions");

    act(() =>
      rendered.result.current.group.update((range) => ({
        ...range,
        to: "2026-10-31",
      })),
    );

    expect(currentParams(rendered)).toEqual({
      plan: "1",
      tab: "transactions",
      from: "2026-10-01",
      to: "2026-10-31",
    });
    expect(rendered.result.current.group.value).toEqual({
      from: "2026-10-01",
      to: "2026-10-31",
    });

    await goBack(rendered);
    expect(rendered.result.current.location.pathname).toBe("/other");
  });

  it("removes a group key the update serializes away", () => {
    const rendered = setup("/?plan=1&from=2026-10-01&to=2026-10-31");

    act(() =>
      rendered.result.current.group.update((range) => ({ ...range, from: null })),
    );

    expect(currentParams(rendered)).toEqual({ plan: "1", to: "2026-10-31" });
  });

  it("clears only the given subset, without adding a history entry", async () => {
    const rendered = setup("/?plan=1&from=2026-10-01&to=2026-10-31");

    act(() => rendered.result.current.group.clear(["from"]));

    expect(currentParams(rendered)).toEqual({ plan: "1", to: "2026-10-31" });
    expect(rendered.result.current.group.value).toEqual({
      from: null,
      to: "2026-10-31",
    });

    await goBack(rendered);
    expect(rendered.result.current.location.pathname).toBe("/other");
  });

  it("clears every group key by default, leaving foreign keys untouched", () => {
    const rendered = setup("/?plan=1&from=2026-10-01&to=2026-10-31&q=market");

    act(() => rendered.result.current.group.clear());

    expect(currentParams(rendered)).toEqual({ plan: "1", q: "market" });
  });
});
