import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  AcceptInvitationResponse,
  CreateInvitationRequest,
  Invitation,
  InvitationPreview,
} from "../dtos";

type PlanParams = { planId: string };
type InvitationParams = PlanParams & { invitationId: string };
type TokenParams = { token: string };

export const invitationHandlers = {
  create(invitation: Invitation): HttpHandler {
    return http.post<PlanParams, CreateInvitationRequest["body"], Invitation>(
      "*/plan/:planId/invitation",
      () => HttpResponse.json(invitation, { status: 201 }),
    );
  },
  revoke(): HttpHandler {
    return http.delete<InvitationParams>(
      "*/plan/:planId/invitation/:invitationId",
      () => new HttpResponse(null, { status: 204 }),
    );
  },
  preview(preview: InvitationPreview): HttpHandler {
    return http.get<TokenParams, never, InvitationPreview>("*/invitation/:token", () =>
      HttpResponse.json(preview),
    );
  },
  accept(response: AcceptInvitationResponse): HttpHandler {
    return http.post<TokenParams, never, AcceptInvitationResponse>(
      "*/invitation/:token/accept",
      () => HttpResponse.json(response),
    );
  },
};
