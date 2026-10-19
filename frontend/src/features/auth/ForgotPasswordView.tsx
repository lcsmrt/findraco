import { Button } from "@/components/button/base/Button";
import { FormField } from "@/components/form/FormField";
import { Input } from "@/components/input/base/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormOutput,
  type ForgotPasswordFormValues,
} from "./authForms";
import { AuthCard } from "./components/AuthCard";

type ForgotPasswordViewProps = {
  /** The link was requested: the form gives way to the confirmation. */
  isSubmitted: boolean;
  isSubmitting: boolean;
  onSubmit: (values: ForgotPasswordFormOutput) => void;
  onBackToSignIn: () => void;
};

export function ForgotPasswordView({
  isSubmitted,
  isSubmitting,
  onSubmit,
  onBackToSignIn,
}: ForgotPasswordViewProps) {
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
        onSubmit={handleSubmit(onSubmit)}
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

            <Button className="w-full" type="submit" isLoading={isSubmitting}>
              Send reset link
            </Button>
          </>
        )}

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
