import { waitFor } from "@testing-library/react";
import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Contact, ContactStatement } from "@/api/dtos";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { contactHandlers } from "./contact.handlers";
import {
  useArchiveContact,
  useCreateContact,
  useDeleteContact,
  useGetContacts,
  useGetContactStatement,
  useRenameContact,
  useUnarchiveContact,
} from "./useContactService";

const plan5: PlanContextValue = { activePlanId: 5, setActivePlanId: () => {}, plans: [], isLoading: false };
const contactsPath = "/api/findraco/plan/5/contacts";

const mae: Contact = { id: 7, name: "Mãe", archived: false, owed: 50, credit: 0, version: 2 };

const statement: ContactStatement = { contact: mae, owed: 50, credit: 0, months: [] };

// A contact write refreshes the lists and the statements, and the rows that carry its name.
const viewKeys = [
  ["contacts", 5, false],
  ["contactStatement", 5, 7],
  ["transactions", 5, {}],
];

function seedViews(queryClient: QueryClient) {
  viewKeys.forEach((key) => queryClient.setQueryData(key, []));
}

function invalidated(queryClient: QueryClient) {
  return viewKeys.map((key) => queryClient.getQueryState(key)?.isInvalidated);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useGetContacts", () => {
  it("GETs the plan's active contacts, and asks for the archived ones too when told to", async () => {
    server.use(contactHandlers.list([mae]));
    const requests = recordRequests();

    const active = renderHookWithProviders(() => useGetContacts(), { plan: plan5 });
    const all = renderHookWithProviders(() => useGetContacts({ archived: true }), { plan: plan5 });

    await waitFor(() => expect(active.result.current.isSuccess && all.result.current.isSuccess).toBe(true));
    expect(requests.map((request) => [request.method, new URL(request.url).pathname + new URL(request.url).search])).toEqual([
      ["GET", contactsPath],
      ["GET", `${contactsPath}?archived=true`],
    ]);
    expect(active.result.current.data).toEqual([mae]);
  });
});

describe("useGetContactStatement", () => {
  it("GETs the statement of the contact in the plan and waits for a contact id", async () => {
    server.use(contactHandlers.statement(statement));
    const requests = recordRequests();

    const waiting = renderHookWithProviders(() => useGetContactStatement(null), { plan: plan5 });
    const { result } = renderHookWithProviders(() => useGetContactStatement(7), { plan: plan5 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map((request) => [request.method, new URL(request.url).pathname])).toEqual([
      ["GET", `${contactsPath}/7/statement`],
    ]);
    expect(result.current.data).toEqual(statement);
    expect(waiting.result.current.fetchStatus).toBe("idle");
  });
});

describe("useCreateContact", () => {
  it("POSTs the name, refreshes the contact views and toasts", async () => {
    server.use(contactHandlers.create(mae));
    const requests = recordRequests();
    const success = vi.spyOn(toast, "success");

    const { result, queryClient } = renderHookWithProviders(() => useCreateContact(), {
      plan: plan5,
      seed: seedViews,
    });
    result.current.mutate({ body: { name: "Mãe" } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map((request) => [request.method, new URL(request.url).pathname])).toEqual([
      ["POST", contactsPath],
    ]);
    expect(await requests[0].json()).toEqual({ name: "Mãe" });
    expect(result.current.data).toEqual(mae);
    expect(invalidated(queryClient)).toEqual([true, true, true]);
    expect(success).toHaveBeenCalledWith("Contact created.");
  });
});

describe("useRenameContact", () => {
  it("PUTs the name with the version it was read at and refreshes the views", async () => {
    server.use(contactHandlers.rename({ ...mae, name: "Mamãe", version: 3 }));
    const requests = recordRequests();
    const success = vi.spyOn(toast, "success");

    const { result, queryClient } = renderHookWithProviders(() => useRenameContact(), {
      plan: plan5,
      seed: seedViews,
    });
    result.current.mutate({ params: { id: 7 }, body: { name: "Mamãe", version: 2 } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map((request) => [request.method, new URL(request.url).pathname])).toEqual([
      ["PUT", `${contactsPath}/7`],
    ]);
    expect(await requests[0].json()).toEqual({ name: "Mamãe", version: 2 });
    expect(invalidated(queryClient)).toEqual([true, true, true]);
    expect(success).toHaveBeenCalledWith("Contact renamed.");
  });
});

describe("useArchiveContact", () => {
  it("POSTs to archive, refreshes the views and toasts", async () => {
    server.use(contactHandlers.archive({ ...mae, owed: 0, archived: true }));
    const requests = recordRequests();
    const success = vi.spyOn(toast, "success");

    const { result, queryClient } = renderHookWithProviders(() => useArchiveContact(), {
      plan: plan5,
      seed: seedViews,
    });
    result.current.mutate({ params: { id: 7 } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map((request) => [request.method, new URL(request.url).pathname])).toEqual([
      ["POST", `${contactsPath}/7/archive`],
    ]);
    expect(invalidated(queryClient)).toEqual([true, true, true]);
    expect(success).toHaveBeenCalledWith("Contact archived.");
  });

  it("shows the refusal copy of a contact that still has a balance", async () => {
    server.use(contactHandlers.archiveRejected(409, "contact-balance-not-zero"));
    const error = vi.spyOn(toast, "error");

    const { result } = renderHookWithProviders(() => useArchiveContact(), { plan: plan5 });
    result.current.mutate({ params: { id: 7 } });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(error).toHaveBeenCalledWith("Settle the balance before archiving", undefined);
  });
});

describe("useUnarchiveContact", () => {
  it("POSTs to unarchive, refreshes the views and toasts", async () => {
    server.use(contactHandlers.unarchive(mae));
    const requests = recordRequests();
    const success = vi.spyOn(toast, "success");

    const { result, queryClient } = renderHookWithProviders(() => useUnarchiveContact(), {
      plan: plan5,
      seed: seedViews,
    });
    result.current.mutate({ params: { id: 7 } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map((request) => [request.method, new URL(request.url).pathname])).toEqual([
      ["POST", `${contactsPath}/7/unarchive`],
    ]);
    expect(invalidated(queryClient)).toEqual([true, true, true]);
    expect(success).toHaveBeenCalledWith("Contact unarchived.");
  });
});

describe("useDeleteContact", () => {
  it("DELETEs the contact, refreshes the views and toasts", async () => {
    server.use(contactHandlers.remove());
    const requests = recordRequests();
    const success = vi.spyOn(toast, "success");

    const { result, queryClient } = renderHookWithProviders(() => useDeleteContact(), {
      plan: plan5,
      seed: seedViews,
    });
    result.current.mutate({ params: { id: 7 } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map((request) => [request.method, new URL(request.url).pathname])).toEqual([
      ["DELETE", `${contactsPath}/7`],
    ]);
    expect(invalidated(queryClient)).toEqual([true, true, true]);
    expect(success).toHaveBeenCalledWith("Contact deleted.");
  });
});
