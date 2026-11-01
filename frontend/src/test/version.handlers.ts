import { http, HttpResponse, type HttpHandler } from "msw";
import type { VersionManifest } from "@/app/providers/utils/appUpdate";

export const versionHandlers = {
  manifest(manifest: VersionManifest): HttpHandler {
    return http.get("*/version.json", () => HttpResponse.json(manifest));
  },
  /** The file answers with an error status, as during a bad deploy. */
  serverError(): HttpHandler {
    return http.get("*/version.json", () => new HttpResponse(null, { status: 500 }));
  },
  /** The body is not the published shape, whatever the status says. */
  malformed(): HttpHandler {
    return http.get("*/version.json", () => HttpResponse.json({ version: 42 }));
  },
};
