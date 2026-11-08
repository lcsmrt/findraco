import { waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { oauthHandlers } from "./oauth.handlers";
import { useGetOAuthClientInfo } from "./useOAuthService";

describe("getOAuthClientInfo", () => {
  it("requests the client by id", async () => {
    const requests = recordRequests();
    server.use(
      oauthHandlers.clientInfo({ name: "Claude", redirectHost: "claude.ai" }),
    );

    const { result } = renderHookWithProviders(() =>
      useGetOAuthClientInfo(
        "https://claude.ai/oauth/mcp-oauth-client-metadata",
      ),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      name: "Claude",
      redirectHost: "claude.ai",
    });
    expect(requests).toHaveLength(1);
    const url = new URL(requests[0].url);
    expect(url.pathname).toBe("/oauth2/client-info");
    expect(url.searchParams.get("client_id")).toBe(
      "https://claude.ai/oauth/mcp-oauth-client-metadata",
    );
    expect(url.searchParams.has("state")).toBe(false);
  });

  it("sends the consent state so the pending redirect is named", async () => {
    const requests = recordRequests();
    server.use(
      oauthHandlers.clientInfo({ name: "Claude", redirectHost: "localhost" }),
    );

    const { result } = renderHookWithProviders(() =>
      useGetOAuthClientInfo(
        "https://claude.ai/oauth/mcp-oauth-client-metadata",
        "state-xyz",
      ),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(new URL(requests[0].url).searchParams.get("state")).toBe(
      "state-xyz",
    );
  });
});
