import { http, HttpResponse, type HttpHandler } from "msw";
import type { OAuthClientInfoResponse, Problem } from "../dtos";

export const oauthHandlers = {
  clientInfo(info: OAuthClientInfoResponse): HttpHandler {
    return http.get<never, never, OAuthClientInfoResponse>("*/oauth2/client-info", () =>
      HttpResponse.json(info),
    );
  },
  clientNotFound(): HttpHandler {
    return http.get<never, never, Problem>("*/oauth2/client-info", () =>
      HttpResponse.json({ type: "urn:findraco:problem:not-found", status: 404 }, { status: 404 }),
    );
  },
};
