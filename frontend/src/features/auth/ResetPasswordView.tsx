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
  return (
    <>
      <Text as="p" variant="secondary" className="text-center">
        This link is invalid or has expired.
      </Text>
      <Button type="button" className="w-full" onClick={onRequestNewLink}>
        Request a new link
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
          Checking your link…
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
            label="New password"
            description={passwordSpacesHint(password)}
          >
            {(field) => <PasswordInput {...field} className="bg-card/70" />}
          </FormField>
          <FormField
            control={control}
            name="confirmPassword"
            label="Confirm new password"
          >
            {(field) => <PasswordInput {...field} className="bg-card/70" />}
          </FormField>
        </div>

        <Button className="w-full" type="submit" isLoading={isSubmitting}>
          Set new password
        </Button>
      </>
    );
  }

  return (
    <AuthCard title="Reset password">
      <form
        id="reset-password-form"
        className="flex flex-col items-center gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {renderContent()}

        <Button
          type="button"
          variant="link"
          className="h-fit p-0"
          onClick={onBackToSignIn}
        >
          Back to sign in
        </Button>
      </form>
    </AuthCard>
  );
}
