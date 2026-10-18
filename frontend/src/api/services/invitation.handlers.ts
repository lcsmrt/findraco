import { http, HttpResponse, type HttpHandler } from "msw";
import type { CreateInvitationRequest, Invitation } from "../dtos";

type PlanParams = { planId: string };

export const invitationHandlers = {
  create(invitation: Invitation): HttpHandler {
    return http.post<PlanParams, CreateInvitationRequest["body"], Invitation>(
      "*/plan/:planId/invitation",
      () => HttpResponse.json(invitation, { status: 201 }),
    );
  },
};
