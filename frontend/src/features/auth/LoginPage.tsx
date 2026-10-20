import { useLogin } from "@/api/services/useAuthService";
import { PATHS } from "@/app/routing/paths";
import { useAuth } from "@/app/providers/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import type { LoginFormOutput } from "./authForms";
import { LoginView } from "./LoginView";
import { readReturnLocation } from "./utils/returnLocation";

export function Login() {
  const { signIn } = useAuth();
  const { mutateAsync: login, isPending: isLoggingIn } = useLogin();

  const navigate = useNavigate();
  const location = useLocation();
  const from = readReturnLocation(location.state);

  async function handleSubmit(credentials: LoginFormOutput) {
    // useLogin already shows the failure as a toast.
    const res = await login({ body: credentials }).catch(() => null);
    if (!res) return;

    await signIn(res.token);
    navigate(from ? `${from.pathname}${from.search}` : PATHS.overview, {
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
