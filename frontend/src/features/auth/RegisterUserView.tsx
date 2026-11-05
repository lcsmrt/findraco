import { Button } from "@/components/button/base/Button";
import { FormField } from "@/components/form/FormField";
import { Input } from "@/components/input/base/Input";
import { Text } from "@/components/typography/base/Text";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  registerUserSchema,
  type RegisterUserFormOutput,
  type RegisterUserFormValues,
} from "./authForms";
import { AuthCard } from "./components/AuthCard";
import { PasswordInput } from "./components/PasswordInput";
import { passwordSpacesHint } from "./utils/passwordSchema";
import { Trans, useTranslation } from "react-i18next";

type RegisterUserViewProps = {
  isSubmitting: boolean;
  onSubmit: (credentials: RegisterUserFormOutput) => Promise<void>;
  onSignIn: () => void;
};

export function RegisterUserView({ isSubmitting, onSubmit, onSignIn }: RegisterUserViewProps) {
  const { t } = useTranslation();

  const { control, handleSubmit } = useForm<
    RegisterUserFormValues,
    unknown,
    RegisterUserFormOutput
  >({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const password = useWatch({ control, name: "password" });

  return (
    <AuthCard title={t("auth.registerUserView.createYourAccount")}>
      <form
        id="register-user-form"
        className="flex flex-col items-center gap-5"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className="flex w-full flex-col gap-3">
          <FormField control={control} name="name" label={t("common.name")}>
            {(field) => (
              <Input
                {...field}
                placeholder={t("auth.registerUserView.fullName")}
                className="bg-card/70"
                autoComplete="off"
              />
            )}
          </FormField>
          <FormField control={control} name="email" label={t("common.email")}>
            {(field) => (
              <Input
                {...field}
                placeholder={t("common.youExampleCom")}
                className="bg-card/70"
                autoComplete="off"
              />
            )}
          </FormField>
          <FormField
            control={control}
            name="password"
            label={t("auth.registerUserView.password")}
            description={passwordSpacesHint(password)}
          >
            {(field) => (
              <PasswordInput {...field} className="bg-card/70" autoComplete="new-password" />
            )}
          </FormField>
        </div>

        <Text as="p" variant="secondary" className="text-center">
          <Trans
            i18nKey="auth.registerUserView.consent"
            components={{ terms: <strong />, privacy: <strong /> }}
          />
        </Text>

        <Button className="w-full" type="submit" isLoading={isSubmitting}>
          {t("auth.registerUserView.signUp")}
        </Button>

        <div className="flex flex-col items-center">
          <Text as="p" variant="secondary">
            {t("auth.registerUserView.alreadyHaveAnAccount")}
          </Text>
          <Button type="button" variant="link" className="h-fit p-0" onClick={onSignIn}>
            {t("auth.registerUserView.signIn")}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
