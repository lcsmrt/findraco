import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { findracoApi } from "../clients/findracoApi";
import {
  AcceptInvitationResponse,
  CreateInvitationRequest,
  Invitation,
  InvitationPreview,
  RevokeInvitationRequest,
} from "../dtos";
import { MutationOptions } from "../types/mutationOptions";
import { QueryOptions } from "../types/queryOptions";
import { buildMutationOptions } from "../utils/buildMutationOptions";

async function createInvitation(
  payload: CreateInvitationRequest,
): Promise<Invitation> {
  const { data } = await findracoApi.post<Invitation>(
    `/plan/${payload.params.planId}/invitation`,
    payload.body,
  );
  return data;
}

export function useCreateInvitation(
  options?: MutationOptions<Invitation, CreateInvitationRequest>,
) {
  return useMutation({
    mutationFn: createInvitation,
    ...buildMutationOptions(
      { successMessage: "Invitation created." },
      options,
    ),
  });
}

async function getInvitationPreview(
  token: string,
): Promise<InvitationPreview> {
  const { data } = await findracoApi.get<InvitationPreview>(
    `/invitation/${token}`,
  );
  return data;
}

export function useGetInvitationPreview(
  token?: string,
  options?: QueryOptions<InvitationPreview>,
) {
  return useQuery({
    queryFn: () => getInvitationPreview(token!),
    queryKey: ["invitationPreview", token],
    enabled: token != null,
    retry: false,
    ...options,
  });
}

async function getPlanInvitations(planId: number): Promise<Invitation[]> {
  const { data } = await findracoApi.get<Invitation[]>(
    `/plan/${planId}/invitation`,
  );
  return data;
}

export function useGetPlanInvitations(
  planId?: number,
  options?: QueryOptions<Invitation[]>,
) {
  return useQuery({
    queryFn: () => getPlanInvitations(planId!),
    queryKey: ["invitations", planId],
    enabled: planId != null,
    ...options,
  });
}

async function revokeInvitation(
  payload: RevokeInvitationRequest,
): Promise<void> {
  await findracoApi.delete(
    `/plan/${payload.params.planId}/invitation/${payload.params.invitationId}`,
  );
}

export function useRevokeInvitation(
  options?: MutationOptions<void, RevokeInvitationRequest>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokeInvitation,
    ...buildMutationOptions(
      { successMessage: "Invitation revoked." },
      {
        ...options,
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries({
            queryKey: ["invitations", variables.params.planId],
          });
          options?.onSuccess?.(data, variables);
        },
      },
    ),
  });
}

async function acceptInvitation(
  token: string,
): Promise<AcceptInvitationResponse> {
  const { data } = await findracoApi.post<AcceptInvitationResponse>(
    `/invitation/${token}/accept`,
  );
  return data;
}

export function useAcceptInvitation(
  options?: MutationOptions<AcceptInvitationResponse, string>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptInvitation,
    ...buildMutationOptions(
      { successMessage: "You joined the plan." },
      {
        ...options,
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries({ queryKey: ["plans"] });
          options?.onSuccess?.(data, variables);
        },
      },
    ),
  });
}
