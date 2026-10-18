import { describe, expect, it, vi } from "vitest";
import { buildTransactionColumns } from "./transactionColumns";

const handlers = {
  onDuplicate: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onSave: vi.fn(),
};

describe("buildTransactionColumns", () => {
  it("omits the Attributed to column for a single-member plan", () => {
    const columns = buildTransactionColumns({ ...handlers, showParticipantsColumn: false });

    expect(columns.map((column) => column.id)).toEqual([
      "description",
      "category",
      "amount",
      "startDate",
      "actions",
    ]);
  });

  it("adds a sortable Attributed to column before the actions when the plan is shared", () => {
    const columns = buildTransactionColumns({ ...handlers, showParticipantsColumn: true });

    expect(columns.map((column) => column.id)).toEqual([
      "description",
      "category",
      "amount",
      "startDate",
      "participants",
      "actions",
    ]);
    expect(columns[4]).toMatchObject({ header: "Attributed to", enableSorting: true });
  });
});
