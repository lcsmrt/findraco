import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  CreatePlanRequest,
  Plan,
  PlanMember,
  TransferOwnershipRequest,
  UpdateMemberRoleRequest,
  UpdatePlanRequest,
} from "../dtos";

type NoParams = Record<string, never>;
type PlanParams = { planId: string };
type MemberParams = PlanParams & { userId: string };

function noContent() {
  return new HttpResponse(null, { status: 204 });
}

export const planHandlers = {
  list(plans: Plan[]): HttpHandler {
    return http.get<NoParams, never, Plan[]>("*/plan", () => HttpResponse.json(plans));
  },
  get(plan: Plan): HttpHandler {
    return http.get<PlanParams, never, Plan>("*/plan/:planId", () =>
      HttpResponse.json(plan),
    );
  },
  members(members: PlanMember[]): HttpHandler {
    return http.get<PlanParams, never, PlanMember[]>("*/plan/:planId/members", () =>
      HttpResponse.json(members),
    );
  },
  create(plan: Plan): HttpHandler {
    return http.post<NoParams, CreatePlanRequest["body"], Plan>("*/plan", () =>
      HttpResponse.json(plan, { status: 201 }),
    );
  },
  /** Fails once `release` resolves, so a test can see the request in flight first. */
  createNetworkError(release: Promise<void> = Promise.resolve()): HttpHandler {
    return http.post("*/plan", async () => {
      await release;
      return HttpResponse.error();
    });
  },
  rename(plan: Plan): HttpHandler {
    return http.put<PlanParams, UpdatePlanRequest["body"], Plan>("*/plan/:planId", () =>
      HttpResponse.json(plan),
    );
  },
  delete(): HttpHandler {
    return http.delete<PlanParams>("*/plan/:planId", noContent);
  },
  leave(): HttpHandler {
    return http.post<PlanParams>("*/plan/:planId/leave", noContent);
  },
  transferOwnership(): HttpHandler {
    return http.post<PlanParams, TransferOwnershipRequest["body"]>(
      "*/plan/:planId/transfer",
      noContent,
    );
  },
  updateMemberRole(member: PlanMember): HttpHandler {
    return http.put<MemberParams, UpdateMemberRoleRequest["body"], PlanMember>(
      "*/plan/:planId/members/:userId",
      () => HttpResponse.json(member),
    );
  },
  updateMemberRoleNetworkError(): HttpHandler {
    return http.put<MemberParams>("*/plan/:planId/members/:userId", () => HttpResponse.error());
  },
  removeMember(): HttpHandler {
    return http.delete<MemberParams>("*/plan/:planId/members/:userId", noContent);
  },
};
