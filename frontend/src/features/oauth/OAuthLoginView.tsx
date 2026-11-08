import { AuthCard } from "@/components/authCard/AuthCard";
import { Button } from "@/components/button/base/Button";
import { Field, FieldLabel } from "@/components/input/base/Field";
import { Input } from "@/components/input/base/Input";
import { PasswordInput } from "@/components/passwordInput/PasswordInput";
import { Text } from "@/components/typography/base/Text";
import { useId } from "react";
import { useTranslation } from "react-i18next";

export type OAuthLoginError = "wrong-credentials" | "rate-limited";

type OAuthLoginViewProps = {
  error?: OAuthLoginError;
  csrfToken: string;
};

/**
 * The sign-in the authorization server redirects to. It is a real form post (top-level navigation):
 * the server answers with a redirect back into the authorization flow, which a `fetch` cannot follow.
 */
export function OAuthLoginView({ error, csrfToken }: OAuthLoginViewProps) {
  const { t } = useTranslation();
  const emailId = useId();
  const passwordId = useId();

  return (
    <AuthCard
      title={t("auth.loginView.signIn")}
      description={t("oauth.login.description")}
    >
      <form
        method="post"
        action="/oauth2/login"
        className="flex flex-col gap-5"
      >
        <input type="hidden" name="_csrf" value={csrfToken} />
        <div className="flex w-full flex-col gap-3">
          <Field>
            <FieldLabel htmlFor={emailId}>{t("common.email")}</FieldLabel>
            <Input
              id={emailId}
              name="email"
              type="email"
              autoComplete="username"
              placeholder={t("common.youExampleCom")}
              required
              className="bg-card/70"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={passwordId}>
              {t("auth.loginView.password")}
            </FieldLabel>
            <PasswordInput
              id={passwordId}
              name="password"
              autoComplete="current-password"
              required
              className="bg-card/70"
            />
          </Field>
          {error && (
            <Text as="p" role="alert" className="text-destructive">
              {error === "rate-limited"
                ? t("problems.rate-limited")
                : t("problems.invalid-credentials")}
            </Text>
          )}
        </div>
        <Button className="w-full" type="submit">
          {t("auth.loginView.signIn")}
        </Button>
      </form>
    </AuthCard>
  );
}
