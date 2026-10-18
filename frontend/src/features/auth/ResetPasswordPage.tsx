import {
  useResetPassword,
  useValidatePasswordResetToken,
} from "@/api/services/useAuthService";
import { PATHS } from "@/app/routing/paths";
import { Button } from "@/components/button/base/Button";
import { FormField } from "@/components/form/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthCard } from "./components/AuthCard";
import { PasswordInput } from "./components/PasswordInput";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "./resetPasswordForm";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { data: validation, isLoading: isValidating } =
    useValidatePasswordResetToken(token, { enabled: token !== "" });
  const isTokenValid = validation?.valid === true;

  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const { mutate: resetPassword, isPending: isResetting } = useResetPassword({
    onSuccess: () => navigate(PATHS.login, { replace: true }),
  });

  const onSubmit = handleSubmit((values: ResetPasswordFormValues) => {
    resetPassword({ body: { token, password: values.password } });
  });

  const renderContent = () => {
    if (isValidating) {
      return (
        <p className="text-muted-foreground text-center text-sm">
          Checking your link…
        </p>
      );
    }

    if (!isTokenValid) {
      return (
        <>
          <p className="text-muted-foreground text-center text-sm">
            This link is invalid or has expired.
          </p>
          <Button
            type="button"
            className="w-full"
            onClick={() => navigate(PATHS.forgotPassword)}
          >
            Request a new link
          </Button>
        </>
      );
    }

    return (
      <>
        <div className="flex w-full flex-col gap-3">
          <FormField control={control} name="password" label="New password">
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

        <Button className="w-full" type="submit" isLoading={isResetting}>
          Set new password
        </Button>
      </>
    );
  };

  return (
    <AuthCard title="Reset password">
      <form
        id="reset-password-form"
        className="flex flex-col items-center gap-5"
        onSubmit={onSubmit}
      >
        {renderContent()}

        <Button
          type="button"
          variant="link"
          className="h-fit p-0 font-bold"
          onClick={() => navigate(PATHS.login)}
        >
          Back to sign in
        </Button>
      </form>
    </AuthCard>
  );
};
