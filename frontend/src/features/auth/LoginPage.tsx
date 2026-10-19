import { useLogin } from "@/api/services/useAuthService";
import { PATHS } from "@/app/routing/paths";
import { useAuth } from "@/app/providers/useAuth";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import type { LoginFormOutput } from "./authForms";
import { LoginView } from "./LoginView";

type LoginLocationState = {
  from?: Location;
};

export function Login() {
  const { signIn } = useAuth();
  const { mutateAsync: login, isPending: isLoggingIn } = useLogin();

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LoginLocationState | null)?.from;

  async function handleSubmit(credentials: LoginFormOutput) {
    // useLogin already shows the failure as a toast.
    const res = await login({ body: credentials }).catch(() => null);
    if (!res) return;

    await signIn(res.token);
    navigate(from ? `${from.pathname}${from.search}` : PATHS.home, {
      replace: true,
    });
  }

  return (
    <LoginView
      isSubmitting={isLoggingIn}
      onSubmit={handleSubmit}
      onForgotPassword={() => navigate(PATHS.forgotPassword)}
      onCreateAccount={() => navigate(PATHS.registerUser, { state: { from } })}
    />
  );
}
