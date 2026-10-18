import { useForgotPassword } from "@/api/services/useAuthService";
import { PATHS } from "@/app/routing/paths";
import { Button } from "@/components/button/base/Button";
import { Field, FieldError, FieldLabel } from "@/components/input/base/Field";
import { Input } from "@/components/input/base/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Please enter your email").email("Invalid email"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: forgotPassword, isPending: isSending } = useForgotPassword({
    onSuccess: () => setIsSubmitted(true),
  });

  const navigate = useNavigate();

  const onSubmit = handleSubmit((values: ForgotPasswordFormValues) => {
    forgotPassword({ body: values });
  });

  return (
    <>

      <form
        id="forgot-password-form"
        className="bg-card border-border flex w-full max-w-xl flex-col items-center gap-5 rounded-lg border p-5 shadow-md"
        onSubmit={onSubmit}
      >
        <h1 className="text-foreground text-2xl font-bold">Forgot password</h1>

        {isSubmitted ? (
          <p className="text-muted-foreground text-center text-sm">
            If an account exists for that email, we sent a link to reset your
            password. It expires in 60 minutes.
          </p>
        ) : (
          <>
            <p className="text-muted-foreground text-center text-sm">
              Enter your account email and we’ll send you a link to choose a new
              password.
            </p>

            <div className="flex w-full flex-col gap-3">
              <Field>
                <FieldLabel htmlFor="email-forgot-password">Email</FieldLabel>
                <Input
                  id="email-forgot-password"
                  placeholder="you@example.com"
                  className="bg-card/70"
                  {...register("email")}
                />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>
            </div>

            <div className="w-full">
              <Button className="w-full" type="submit" isLoading={isSending}>
                <p className="text-sm font-semibold">Send reset link</p>
              </Button>
            </div>
          </>
        )}

        <Button
          type="button"
          variant="link"
          className="h-fit p-0 font-bold"
          onClick={() => navigate(PATHS.login)}
        >
          Back to sign in
        </Button>
      </form>
    </>
  );
};
