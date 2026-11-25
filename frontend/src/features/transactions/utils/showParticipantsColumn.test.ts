import type { ParticipantShare, Transaction } from "@/api/dtos/transaction";
import { describe, expect, it } from "vitest";
import { showParticipantsColumn } from "./showParticipantsColumn";

function tx(participants: ParticipantShare[]): Transaction {
  return {
    id: 1,
    permissions: { edit: true, delete: true },
    version: 0,
    type: "DEBIT",
    amount: 80,
    description: "Pizza",
    startDate: "2026-11-25",
    endDate: "2026-11-25",
    splitMode: "EQUAL",
    participants,
    items: [],
    status: "ACTUAL",
    requiresConfirmation: false,
  };
}

const member: ParticipantShare = { id: 7, name: "Lucas", shareAmount: 40 };
const contact: ParticipantShare = { id: null, contactId: 3, name: "Mãe", shareAmount: 40 };

describe("showParticipantsColumn", () => {
  it("hides the column in a plan of one member whose rows are all the member's own", () => {
    expect(showParticipantsColumn(1, [tx([member])])).toBe(false);
  });

  it("shows it in a plan of several members", () => {
    expect(showParticipantsColumn(2, [tx([member])])).toBe(true);
  });

  it("shows it in a plan of one member when a row has a contact's share, so her name reads on the table", () => {
    expect(showParticipantsColumn(1, [tx([member]), tx([member, contact])])).toBe(true);
  });
});
