import type { OAuthClientInfoResponse } from "@/api/dtos";
import { AuthCard } from "@/components/authCard/AuthCard";
import { Button } from "@/components/button/base/Button";
import { Spinner } from "@/components/spinner/base/Spinner";
import { Text } from "@/components/typography/base/Text";
import { useTranslation } from "react-i18next";

type OAuthConsentViewProps = {
  isLoading: boolean;
  /** Absent once loading ends means the app is unknown: the screen offers no way to allow it. */
  client?: OAuthClientInfoResponse;
  clientId: string;
  scope: string;
  state: string;
  csrfToken: string;
};

/**
 * Asks the signed-in user to allow or deny the app. The decision is a real form post (top-level
 * navigation) because the server answers by redirecting back to the app.
 */
export function OAuthConsentView({
  isLoading,
  client,
  clientId,
  scope,
  state,
  csrfToken,
}: OAuthConsentViewProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <AuthCard title={t("oauth.consent.loading")}>
        <Spinner className="mx-auto" />
      </AuthCard>
    );
  }

  if (!client) {
    return (
      <AuthCard
        title={t("oauth.consent.unknownTitle")}
        description={t("oauth.consent.unknownDescription")}
      />
    );
  }

  return (
    <AuthCard
      title={t("oauth.consent.title", { name: client.name })}
      description={t("oauth.consent.description", { name: client.name })}
    >
      <form
        method="post"
        action="/oauth2/authorize"
        className="flex flex-col gap-5"
      >
        <input type="hidden" name="client_id" value={clientId} />
        <input type="hidden" name="state" value={state} />
        <input type="hidden" name="scope" value={scope} />
        <input type="hidden" name="_csrf" value={csrfToken} />
        <div className="flex flex-col gap-2">
          <Text variant="label">{t("oauth.consent.canDo")}</Text>
          <ul className="list-disc pl-5">
            <li>
              <Text>{t("oauth.consent.readPlans")}</Text>
            </li>
            <li>
              <Text>{t("oauth.consent.writeTransactions")}</Text>
            </li>
          </ul>
          <Text variant="secondary">
            {t("oauth.consent.redirectsTo", { host: client.redirectHost })}
          </Text>
        </div>
        <div className="flex gap-3">
          <Button
            type="submit"
            name="consent_action"
            value="deny"
            variant="outline"
            className="flex-1"
          >
            {t("oauth.consent.deny")}
          </Button>
          <Button
            type="submit"
            name="consent_action"
            value="allow"
            className="flex-1"
          >
            {t("oauth.consent.allow")}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
