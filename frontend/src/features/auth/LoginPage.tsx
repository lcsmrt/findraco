import { useLogin } from "@/api/services/useAuthService";
import { PATHS } from "@/app/routing/paths";
import { Button } from "@/components/button/base/Button";
import { FormField } from "@/components/form/FormField";
import { Input } from "@/components/input/base/Input";
import { useAuth } from "@/app/providers/useAuth";
import { Text } from "@/components/typography/base/Text";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import {
  loginSchema,
  type LoginFormOutput,
  type LoginFormValues,
} from "./authForms";
import { AuthCard } from "./components/AuthCard";
import { PasswordInput } from "./components/PasswordInput";

type LoginLocationState = {
  from?: Location;
};

export function Login() {
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

  const { signIn } = useAuth();
  const { mutateAsync: login, isPending: isLoggingIn } = useLogin();

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LoginLocationState | null)?.from;

  const onSubmit = handleSubmit(async (credentials: LoginFormOutput) => {
    // useLogin already shows the failure as a toast.
    const res = await login({ body: credentials }).catch(() => null);
    if (!res) return;

    await signIn(res.token);
    navigate(from ? `${from.pathname}${from.search}` : PATHS.home, {
      replace: true,
    });
  });

  return (
    <AuthCard title="Sign in">
      <form
        id="login-form"
        className="flex flex-col items-center gap-5"
        onSubmit={onSubmit}
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
            onClick={() => navigate(PATHS.forgotPassword)}
          >
            Forgot password?
          </Button>
        </div>

        <Button className="w-full" type="submit" isLoading={isLoggingIn}>
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
            onClick={() => navigate(PATHS.registerUser, { state: { from } })}
          >
            Create one now
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
