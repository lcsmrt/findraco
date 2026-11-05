import { Button } from "@/components/button/base/Button";
import { FormField } from "@/components/form/FormField";
import { Input } from "@/components/input/base/Input";
import { Text } from "@/components/typography/base/Text";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormOutput, type LoginFormValues } from "./authForms";
import { AuthCard } from "./components/AuthCard";
import { PasswordInput } from "./components/PasswordInput";
import { useTranslation } from "react-i18next";

type LoginViewProps = {
  isSubmitting: boolean;
  onSubmit: (credentials: LoginFormOutput) => Promise<void>;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
};

export function LoginView({
  isSubmitting,
  onSubmit,
  onForgotPassword,
  onCreateAccount,
}: LoginViewProps) {
  const { t } = useTranslation();

  const { control, handleSubmit } = useForm<LoginFormValues, unknown, LoginFormOutput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <AuthCard title={t("auth.loginView.signIn")}>
      <form
        id="login-form"
        className="flex flex-col items-center gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex w-full flex-col gap-3">
          <FormField control={control} name="email" label={t("common.email")}>
            {(field) => (
              <Input {...field} placeholder={t("common.youExampleCom")} className="bg-card/70" />
            )}
          </FormField>
          <FormField control={control} name="password" label={t("auth.loginView.password")}>
            {(field) => <PasswordInput {...field} className="bg-card/70" />}
          </FormField>
          <Button
            type="button"
            variant="link"
            className="h-fit self-end p-0"
            onClick={onForgotPassword}
          >
            {t("auth.loginView.forgotPassword")}
          </Button>
        </div>

        <Button className="w-full" type="submit" isLoading={isSubmitting}>
          {t("auth.loginView.signIn")}
        </Button>

        <div className="flex flex-col items-center">
          <Text as="p" variant="secondary">
            {t("auth.loginView.donTHaveAnAccount")}
          </Text>
          <Button type="button" variant="link" className="h-fit p-0" onClick={onCreateAccount}>
            {t("auth.loginView.createOneNow")}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
