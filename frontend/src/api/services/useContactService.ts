import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { findracoApi } from "../clients/findracoApi";
import type {
  Contact,
  ContactRequest,
  ContactsFilter,
  ContactStatement,
  CreateContactRequest,
  UpdateContactRequest,
} from "../dtos";
import type { MutationOptions } from "../types/mutationOptions";
import type { QueryOptions } from "../types/queryOptions";
import { buildMutationOptions } from "../utils/buildMutationOptions";
import { usePlanContext } from "@/app/providers/usePlanContext";

/**
 * A contact write moves a balance or a name that the contact lists, its statement and the rows that
 * carry its shares all show. Not awaited: active queries refetch on their own, inactive ones turn stale.
 */
function invalidateContactData(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ["contacts"] });
  queryClient.invalidateQueries({ queryKey: ["contactStatement"] });
  queryClient.invalidateQueries({ queryKey: ["transactions"] });
}

async function getContacts(planId: number, filter?: ContactsFilter): Promise<Contact[]> {
  const { data } = await findracoApi.get<Contact[]>(`/plan/${planId}/contacts`, {
    params: filter?.archived ? { archived: true } : undefined,
  });
  return data;
}

export function useGetContacts(filter?: ContactsFilter, options?: QueryOptions<Contact[]>) {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getContacts(activePlanId!, filter),
    queryKey: ["contacts", activePlanId, filter?.archived ?? false],
    ...options,
    enabled: activePlanId != null && (options?.enabled ?? true),
  });
}

async function getContactStatement(planId: number, contactId: number): Promise<ContactStatement> {
  const { data } = await findracoApi.get<ContactStatement>(
    `/plan/${planId}/contacts/${contactId}/statement`,
  );
  return data;
}

export function useGetContactStatement(
  contactId: number | null | undefined,
  options?: QueryOptions<ContactStatement>,
) {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getContactStatement(activePlanId!, contactId!),
    queryKey: ["contactStatement", activePlanId, contactId],
    ...options,
    enabled: activePlanId != null && contactId != null && (options?.enabled ?? true),
  });
}

async function createContact(planId: number, payload: CreateContactRequest): Promise<Contact> {
  const { data } = await findracoApi.post<Contact>(`/plan/${planId}/contacts`, payload.body);
  return data;
}

export function useCreateContact(options?: MutationOptions<Contact, CreateContactRequest>) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: CreateContactRequest) => createContact(activePlanId!, payload),
    ...buildMutationOptions(
      { successMessage: "api.toast.contactCreated" },
      {
        ...options,
        onSuccess: (data, variables) => {
          invalidateContactData(queryClient);
          options?.onSuccess?.(data, variables);
        },
      },
    ),
  });
}

async function renameContact(planId: number, { params, body }: UpdateContactRequest): Promise<Contact> {
  const { data } = await findracoApi.put<Contact>(`/plan/${planId}/contacts/${params.id}`, body);
  return data;
}

export function useRenameContact(options?: MutationOptions<Contact, UpdateContactRequest>) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: UpdateContactRequest) => renameContact(activePlanId!, payload),
    ...buildMutationOptions(
      { successMessage: "api.toast.contactRenamed" },
      {
        ...options,
        onSuccess: (data, variables) => {
          invalidateContactData(queryClient);
          options?.onSuccess?.(data, variables);
        },
      },
    ),
  });
}

async function archiveContact(planId: number, { params }: ContactRequest): Promise<Contact> {
  const { data } = await findracoApi.post<Contact>(`/plan/${planId}/contacts/${params.id}/archive`);
  return data;
}

export function useArchiveContact(options?: MutationOptions<Contact, ContactRequest>) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: ContactRequest) => archiveContact(activePlanId!, payload),
    ...buildMutationOptions(
      { successMessage: "api.toast.contactArchived" },
      {
        ...options,
        onSuccess: (data, variables) => {
          invalidateContactData(queryClient);
          options?.onSuccess?.(data, variables);
        },
      },
    ),
  });
}

async function unarchiveContact(planId: number, { params }: ContactRequest): Promise<Contact> {
  const { data } = await findracoApi.post<Contact>(`/plan/${planId}/contacts/${params.id}/unarchive`);
  return data;
}

export function useUnarchiveContact(options?: MutationOptions<Contact, ContactRequest>) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: ContactRequest) => unarchiveContact(activePlanId!, payload),
    ...buildMutationOptions(
      { successMessage: "api.toast.contactUnarchived" },
      {
        ...options,
        onSuccess: (data, variables) => {
          invalidateContactData(queryClient);
          options?.onSuccess?.(data, variables);
        },
      },
    ),
  });
}

async function deleteContact(planId: number, { params }: ContactRequest): Promise<void> {
  await findracoApi.delete(`/plan/${planId}/contacts/${params.id}`);
}

export function useDeleteContact(options?: MutationOptions<void, ContactRequest>) {
  const queryClient = useQueryClient();
  const { activePlanId } = usePlanContext();
  return useMutation({
    mutationFn: (payload: ContactRequest) => deleteContact(activePlanId!, payload),
    ...buildMutationOptions(
      { successMessage: "api.toast.contactDeleted" },
      {
        ...options,
        onSuccess: (data, variables) => {
          invalidateContactData(queryClient);
          options?.onSuccess?.(data, variables);
        },
      },
    ),
  });
}
