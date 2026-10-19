import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { findracoApi } from "../clients/findracoApi";
import {
  CreatePlanRequest,
  Plan,
  PlanMember,
  PlanResponse,
  RemoveMemberRequest,
  TransferOwnershipRequest,
  UpdateMemberRoleRequest,
  UpdatePlanRequest,
} from "../dtos";
import { MutationOptions } from "../types/mutationOptions";
import { QueryOptions } from "../types/queryOptions";
import { buildMutationOptions } from "../utils/buildMutationOptions";

function mapPlan(raw: PlanResponse): Plan {
  return {
    id: raw.id,
    name: raw.name,
    isDefault: raw.default,
    myRole: raw.myRole,
  };
}

async function getPlans(): Promise<Plan[]> {
  const { data } = await findracoApi.get<PlanResponse[]>("/plan");
  return data.map(mapPlan);
}

export function useGetPlans(options?: QueryOptions<Plan[]>) {
  return useQuery({
    queryFn: getPlans,
    queryKey: ["plans"],
    ...options,
  });
}

async function getPlan(id: number): Promise<Plan> {
  const { data } = await findracoApi.get<PlanResponse>(`/plan/${id}`);
  return mapPlan(data);
}

export function useGetPlan(id?: number, options?: QueryOptions<Plan>) {
  return useQuery({
    queryFn: () => getPlan(id!),
    queryKey: ["plan", id],
    enabled: id != null,
    ...options,
  });
}

async function getPlanMembers(planId: number): Promise<PlanMember[]> {
  const { data } = await findracoApi.get<PlanMember[]>(
    `/plan/${planId}/members`,
  );
  return data;
}

export function useGetPlanMembers(
  planId?: number,
  options?: QueryOptions<PlanMember[]>,
) {
  return useQuery({
    queryFn: () => getPlanMembers(planId!),
    queryKey: ["members", planId],
    enabled: planId != null,
    ...options,
  });
}

async function createPlan(payload: CreatePlanRequest): Promise<Plan> {
  const { data } = await findracoApi.post<PlanResponse>("/plan", payload.body);
  return mapPlan(data);
}

export function useCreatePlan(
  options?: MutationOptions<Plan, CreatePlanRequest>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlan,
    ...buildMutationOptions(
      { successMessage: "Plan created successfully." },
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

async function updateMemberRole(
  payload: UpdateMemberRoleRequest,
): Promise<PlanMember> {
  const { data } = await findracoApi.put<PlanMember>(
    `/plan/${payload.params.planId}/members/${payload.params.userId}`,
    payload.body,
  );
  return data;
}

export function useUpdateMemberRole(
  options?: MutationOptions<PlanMember, UpdateMemberRoleRequest>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMemberRole,
    ...buildMutationOptions(
      { successMessage: "Member role updated successfully." },
      {
        ...options,
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries({
            queryKey: ["members", variables.params.planId],
          });
          queryClient.invalidateQueries({ queryKey: ["plans"] });
          options?.onSuccess?.(data, variables);
        },
      },
    ),
  });
}

async function removeMember(payload: RemoveMemberRequest): Promise<void> {
  await findracoApi.delete(
    `/plan/${payload.params.planId}/members/${payload.params.userId}`,
  );
}

export function useRemoveMember(
  options?: MutationOptions<void, RemoveMemberRequest>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeMember,
    ...buildMutationOptions(
      { successMessage: "Member removed successfully." },
      {
        ...options,
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries({
            queryKey: ["members", variables.params.planId],
          });
          queryClient.invalidateQueries({ queryKey: ["plans"] });
          options?.onSuccess?.(data, variables);
        },
      },
    ),
  });
}

async function renamePlan(payload: UpdatePlanRequest): Promise<Plan> {
  const { data } = await findracoApi.put<PlanResponse>(
    `/plan/${payload.params.planId}`,
    payload.body,
  );
  return mapPlan(data);
}

export function useRenamePlan(
  options?: MutationOptions<Plan, UpdatePlanRequest>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: renamePlan,
    ...buildMutationOptions(
      { successMessage: "Plan renamed successfully." },
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

async function deletePlan(planId: number): Promise<void> {
  await findracoApi.delete(`/plan/${planId}`);
}

export function useDeletePlan(options?: MutationOptions<void, number>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlan,
    ...buildMutationOptions(
      { successMessage: "Plan archived successfully." },
      {
        ...options,
        onSuccess: (data, planId) => {
          queryClient.invalidateQueries({ queryKey: ["plans"] });
          queryClient.invalidateQueries({ queryKey: ["members", planId] });
          options?.onSuccess?.(data, planId);
        },
      },
    ),
  });
}

async function leavePlan(planId: number): Promise<void> {
  await findracoApi.post(`/plan/${planId}/leave`);
}

export function useLeavePlan(options?: MutationOptions<void, number>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leavePlan,
    ...buildMutationOptions(
      { successMessage: "You left the plan successfully." },
      {
        ...options,
        onSuccess: (data, planId) => {
          queryClient.invalidateQueries({ queryKey: ["plans"] });
          queryClient.invalidateQueries({ queryKey: ["members", planId] });
          options?.onSuccess?.(data, planId);
        },
      },
    ),
  });
}

async function transferOwnership(
  payload: TransferOwnershipRequest,
): Promise<void> {
  await findracoApi.post(
    `/plan/${payload.params.planId}/transfer`,
    payload.body,
  );
}

export function useTransferOwnership(
  options?: MutationOptions<void, TransferOwnershipRequest>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transferOwnership,
    ...buildMutationOptions(
      { successMessage: "Plan ownership transferred successfully." },
      {
        ...options,
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries({ queryKey: ["plans"] });
          queryClient.invalidateQueries({
            queryKey: ["members", variables.params.planId],
          });
          options?.onSuccess?.(data, variables);
        },
      },
    ),
  });
}
