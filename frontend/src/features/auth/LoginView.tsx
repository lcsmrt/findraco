import { Button } from "@/components/button/base/Button";
import { FormField } from "@/components/form/FormField";
import { Input } from "@/components/input/base/Input";
import { Text } from "@/components/typography/base/Text";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  loginSchema,
  type LoginFormOutput,
  type LoginFormValues,
} from "./authForms";
import { AuthCard } from "./components/AuthCard";
import { PasswordInput } from "./components/PasswordInput";

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
  const { control, handleSubmit } = useForm<
    LoginFormValues,
    unknown,
    LoginFormOutput
  >({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <AuthCard title="Sign in">
      <form
        id="login-form"
        className="flex flex-col items-center gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
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
          <FormField control={control} name="password" label="Password">
            {(field) => <PasswordInput {...field} className="bg-card/70" />}
          </FormField>
          <Button
            type="button"
            variant="link"
            className="h-fit self-end p-0"
            onClick={onForgotPassword}
          >
            Forgot password?
          </Button>
        </div>

        <Button className="w-full" type="submit" isLoading={isSubmitting}>
          Sign in
        </Button>

        <div className="flex flex-col items-center">
          <Text as="p" variant="secondary">
            Don’t have an account?
          </Text>
          <Button
            type="button"
            variant="link"
            className="h-fit p-0"
            onClick={onCreateAccount}
          >
            Create one now
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
