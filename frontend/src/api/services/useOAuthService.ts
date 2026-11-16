import { useQuery } from "@tanstack/react-query";
import { findracoApi } from "../clients/findracoApi";
import type { OAuthClientInfoResponse } from "../dtos";
import type { QueryOptions } from "../types/queryOptions";

// The authorization server answers at the site root, outside the API base path. The consent `state` lets it name the
// host of the redirect this request asked for.
async function getOAuthClientInfo(
  clientId: string,
  state?: string,
): Promise<OAuthClientInfoResponse> {
  const { data } = await findracoApi.get<OAuthClientInfoResponse>(
    "/oauth2/client-info",
    {
      baseURL: "",
      params: { client_id: clientId, state },
    },
  );
  return data;
}

export function useGetOAuthClientInfo(
  clientId?: string,
  state?: string,
  options?: QueryOptions<OAuthClientInfoResponse>,
) {
  return useQuery({
    queryFn: () => getOAuthClientInfo(clientId!, state),
    queryKey: ["oauthClientInfo", clientId, state],
    enabled: clientId != null,
    retry: false,
    ...options,
  });
}
