import { useGetOAuthClientInfo } from "@/api/services/useOAuthService";
import { useSearchParams } from "react-router-dom";
import { OAuthConsentView } from "./OAuthConsentView";
import { readCsrfToken } from "./utils/csrfToken";

export function OAuthConsentPage() {
  const [params] = useSearchParams();
  const clientId = params.get("client_id") ?? undefined;

  const state = params.get("state") ?? undefined;

  const { data: client, isLoading } = useGetOAuthClientInfo(clientId, state);

  return (
    <OAuthConsentView
      isLoading={isLoading}
      client={client}
      clientId={clientId ?? ""}
      scope={params.get("scope") ?? ""}
      state={state ?? ""}
      csrfToken={readCsrfToken(document.cookie)}
    />
  );
}
