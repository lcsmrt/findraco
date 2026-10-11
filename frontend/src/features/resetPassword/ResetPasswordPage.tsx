import {
  useResetPassword,
  useValidatePasswordResetToken,
} from "@/api/services/useAuthService";
import { PATHS } from "@/app/routing/paths";
import { AppVersion } from "@/components/appVersion/AppVersion";
import { Button } from "@/components/button/Button";
import { Field, FieldError, FieldLabel } from "@/components/input/base/Field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/input/base/InputGroup";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(1, "Please enter a new password"),
    confirmPassword: z.string().min(1, "Please confirm the new password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { data: validation, isLoading: isValidating } =
    useValidatePasswordResetToken(token, { enabled: token !== "" });
  const isTokenValid = validation?.valid === true;

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ResetPasswordFormValues>({
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
            <p className="text-sm font-semibold">Request a new link</p>
          </Button>
        </>
      );
    }

    return (
      <>
        <div className="flex w-full flex-col gap-3">
          <Field>
            <FieldLabel htmlFor="password-reset-password">
              New password
            </FieldLabel>
            <InputGroup className="bg-card/70">
              <InputGroupInput
                id="password-reset-password"
                placeholder="New password"
                type={isPasswordVisible ? "text" : "password"}
                {...register("password")}
              />
              <InputGroupAddon align="inline-end">
                <Button
                  className="h-8 w-8 rounded-full p-0"
                  variant="ghost"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  type="button"
                >
                  {isPasswordVisible ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeClosed className="h-5 w-5" />
                  )}
                </Button>
              </InputGroupAddon>
            </InputGroup>
            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password-reset-password">
              Confirm new password
            </FieldLabel>
            <InputGroup className="bg-card/70">
              <InputGroupInput
                id="confirm-password-reset-password"
                placeholder="Confirm new password"
                type={isPasswordVisible ? "text" : "password"}
                {...register("confirmPassword")}
              />
            </InputGroup>
            {errors.confirmPassword && (
              <FieldError>{errors.confirmPassword.message}</FieldError>
            )}
          </Field>
        </div>

        <div className="w-full">
          <Button className="w-full" type="submit" isLoading={isResetting}>
            <p className="text-sm font-semibold">Set new password</p>
          </Button>
        </div>
      </>
    );
  };

  return (
    <>
      <header className="flex flex-1 items-end gap-3">
        <img
          src={"/findraco-logo-128.png"}
          alt="findraco logo"
          className="h-12"
          style={{
            filter: "drop-shadow(0 0 10px hsl(var(--primary) / 0.7))",
          }}
        />
        <span className="text-foreground text-2xl font-bold">findraco</span>
      </header>

      <form
        id="reset-password-form"
        className="bg-card ring-primary/15 flex w-full max-w-xl flex-col items-center gap-5 rounded-lg p-5 ring-1"
        onSubmit={onSubmit}
      >
        <h1 className="text-foreground text-2xl font-bold">Reset password</h1>

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

      <footer className="flex flex-1 flex-col items-center justify-end">
        <p className="text-muted-foreground text-xs">© 2026 Nameless Comp</p>
        <AppVersion />
      </footer>
    </>
  );
};
