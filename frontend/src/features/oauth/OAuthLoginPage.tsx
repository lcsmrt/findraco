import { useSearchParams } from "react-router-dom";
import { OAuthLoginView, type OAuthLoginError } from "./OAuthLoginView";
import { readCsrfToken } from "./utils/csrfToken";

// The server redirects a failed sign-in back here with a bare `?error`, or `?error=rate-limited`.
function readError(params: URLSearchParams): OAuthLoginError | undefined {
  if (!params.has("error")) return undefined;
  return params.get("error") === "rate-limited" ? "rate-limited" : "wrong-credentials";
}

export function OAuthLoginPage() {
  const [params] = useSearchParams();

  return <OAuthLoginView error={readError(params)} csrfToken={readCsrfToken(document.cookie)} />;
}
