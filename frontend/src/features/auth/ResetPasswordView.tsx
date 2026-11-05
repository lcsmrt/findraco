import { Button } from "@/components/button/base/Button";
import { FormField } from "@/components/form/FormField";
import { Text } from "@/components/typography/base/Text";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { AuthCard } from "./components/AuthCard";
import { PasswordInput } from "./components/PasswordInput";
import { passwordSpacesHint } from "./utils/passwordSchema";
import {
  resetPasswordSchema,
  type ResetPasswordFormOutput,
  type ResetPasswordFormValues,
} from "./authForms";
import { useTranslation } from "react-i18next";

type ResetPasswordViewProps = {
  isValidating: boolean;
  isTokenValid: boolean;
  isSubmitting: boolean;
  onSubmit: (values: ResetPasswordFormOutput) => void;
  onRequestNewLink: () => void;
  onBackToSignIn: () => void;
};

type InvalidLinkProps = {
  onRequestNewLink: () => void;
};

function InvalidLink({ onRequestNewLink }: InvalidLinkProps) {
  const { t } = useTranslation();

  return (
    <>
      <Text as="p" variant="secondary" className="text-center">
        {t("auth.invalidLink.thisLinkIsInvalidOr")}
      </Text>
      <Button type="button" className="w-full" onClick={onRequestNewLink}>
        {t("auth.invalidLink.requestANewLink")}
      </Button>
    </>
  );
}

export function ResetPasswordView({
  isValidating,
  isTokenValid,
  isSubmitting,
  onSubmit,
  onRequestNewLink,
  onBackToSignIn,
}: ResetPasswordViewProps) {
  const { t } = useTranslation();

  const { control, handleSubmit } = useForm<
    ResetPasswordFormValues,
    unknown,
    ResetPasswordFormOutput
  >({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = useWatch({ control, name: "password" });

  function renderContent() {
    if (isValidating) {
      return (
        <Text as="p" variant="secondary" className="text-center">
          {t("auth.resetPasswordView.checkingYourLink")}
        </Text>
      );
    }

    if (!isTokenValid) {
      return <InvalidLink onRequestNewLink={onRequestNewLink} />;
    }

    return (
      <>
        <div className="flex w-full flex-col gap-3">
          <FormField
            control={control}
            name="password"
            label={t("auth.resetPasswordView.newPassword")}
            description={passwordSpacesHint(password)}
          >
            {(field) => <PasswordInput {...field} className="bg-card/70" />}
          </FormField>
          <FormField
            control={control}
            name="confirmPassword"
            label={t("auth.resetPasswordView.confirmNewPassword")}
          >
            {(field) => <PasswordInput {...field} className="bg-card/70" />}
          </FormField>
        </div>

        <Button className="w-full" type="submit" isLoading={isSubmitting}>
          {t("auth.resetPasswordView.setNewPassword")}
        </Button>
      </>
    );
  }

  return (
    <AuthCard title={t("auth.resetPasswordView.resetPassword")}>
      <form
        id="reset-password-form"
        className="flex flex-col items-center gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {renderContent()}

        <Button type="button" variant="link" className="h-fit p-0" onClick={onBackToSignIn}>
          {t("auth.resetPasswordView.backToSignIn")}
        </Button>
      </form>
    </AuthCard>
  );
}
