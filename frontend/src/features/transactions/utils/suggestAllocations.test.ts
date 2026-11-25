import { describe, expect, it } from "vitest";
import { suggestAllocations } from "./suggestAllocations";

// Owes R$ 200 (October) and R$ 300 (November), oldest first.
const shares = [
  { participantId: 10, open: 200 },
  { participantId: 11, open: 300 },
];

describe("suggestAllocations", () => {
  it("fills oldest first up to the amount", () => {
    expect(suggestAllocations(shares, 300)).toEqual({
      allocations: [
        { participantId: 10, amount: 200 },
        { participantId: 11, amount: 100 },
      ],
      excess: 0,
    });
  });

  it("reports the excess", () => {
    expect(suggestAllocations(shares, 600)).toEqual({
      allocations: [
        { participantId: 10, amount: 200 },
        { participantId: 11, amount: 300 },
      ],
      excess: 100,
    });
  });

  it("suggests nothing for a payment of zero or an empty amount", () => {
    expect(suggestAllocations(shares, 0)).toEqual({ allocations: [], excess: 0 });
    expect(suggestAllocations(shares, null)).toEqual({ allocations: [], excess: 0 });
  });

  it("takes only the open part of a partly paid share and keeps cents exact", () => {
    expect(suggestAllocations([{ participantId: 1, open: 0.3 }, { participantId: 2, open: 99.7 }], 0.1 + 0.2 + 50)).toEqual({
      allocations: [
        { participantId: 1, amount: 0.3 },
        { participantId: 2, amount: 50 },
      ],
      excess: 0,
    });
  });
});
