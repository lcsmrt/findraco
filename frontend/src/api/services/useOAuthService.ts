import { useQuery } from "@tanstack/react-query";
import { findracoApi } from "../clients/findracoApi";
import type { OAuthClientInfoResponse } from "../dtos";
import type { QueryOptions } from "../types/queryOptions";

// The authorization server answers at the site root, outside the API base path.
async function getOAuthClientInfo(clientId: string): Promise<OAuthClientInfoResponse> {
  const { data } = await findracoApi.get<OAuthClientInfoResponse>("/oauth2/client-info", {
    baseURL: "",
    params: { client_id: clientId },
  });
  return data;
}

export function useGetOAuthClientInfo(
  clientId?: string,
  options?: QueryOptions<OAuthClientInfoResponse>,
) {
  return useQuery({
    queryFn: () => getOAuthClientInfo(clientId!),
    queryKey: ["oauthClientInfo", clientId],
    enabled: clientId != null,
    retry: false,
    ...options,
  });
}
