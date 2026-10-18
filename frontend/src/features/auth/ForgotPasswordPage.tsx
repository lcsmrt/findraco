import { useForgotPassword } from "@/api/services/useAuthService";
import { PATHS } from "@/app/routing/paths";
import { Button } from "@/components/button/base/Button";
import { FormField } from "@/components/form/FormField";
import { Input } from "@/components/input/base/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormOutput,
  type ForgotPasswordFormValues,
} from "./authForms";
import { AuthCard } from "./components/AuthCard";

export const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { control, handleSubmit } = useForm<
    ForgotPasswordFormValues,
    unknown,
    ForgotPasswordFormOutput
  >({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: forgotPassword, isPending: isSending } = useForgotPassword({
    onSuccess: () => setIsSubmitted(true),
  });

  const navigate = useNavigate();

  const onSubmit = handleSubmit((values: ForgotPasswordFormOutput) => {
    forgotPassword({ body: values });
  });

  return (
    <AuthCard
      title="Forgot password"
      description={
        isSubmitted
          ? "If an account exists for that email, we sent a link to reset your password. It expires in 60 minutes."
          : "Enter your account email and we’ll send you a link to choose a new password."
      }
    >
      <form
        id="forgot-password-form"
        className="flex flex-col items-center gap-5"
        onSubmit={onSubmit}
      >
        {!isSubmitted && (
          <>
            <div className="flex w-full flex-col gap-3">
              <FormField control={control} name="email" label="Email">
                {(field) => (
                  <Input
                    {...field}
                    placeholder="you@example.com"
                    className="bg-card/70"
                  />
                )}
              </FormField>
            </div>

            <Button className="w-full" type="submit" isLoading={isSending}>
              Send reset link
            </Button>
          </>
        )}

        <Button
          type="button"
          variant="link"
          className="h-fit p-0"
          onClick={() => navigate(PATHS.login)}
        >
          Back to sign in
        </Button>
      </form>
    </AuthCard>
  );
};
