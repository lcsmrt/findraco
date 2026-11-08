import { useGetOAuthClientInfo } from "@/api/services/useOAuthService";
import { useSearchParams } from "react-router-dom";
import { OAuthConsentView } from "./OAuthConsentView";
import { readCsrfToken } from "./utils/csrfToken";

export function OAuthConsentPage() {
  const [params] = useSearchParams();
  const clientId = params.get("client_id") ?? undefined;

  const { data: client, isLoading } = useGetOAuthClientInfo(clientId);

  return (
    <OAuthConsentView
      isLoading={isLoading}
      client={client}
      clientId={clientId ?? ""}
      scope={params.get("scope") ?? ""}
      state={params.get("state") ?? ""}
      csrfToken={readCsrfToken(document.cookie)}
    />
  );
}
