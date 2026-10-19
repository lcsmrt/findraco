import {
  useResetPassword,
  useValidatePasswordResetToken,
} from "@/api/services/useAuthService";
import { PATHS } from "@/app/routing/paths";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ResetPasswordFormOutput } from "./authForms";
import { ResetPasswordView } from "./ResetPasswordView";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { data: validation, isLoading: isValidating } =
    useValidatePasswordResetToken(token, { enabled: token !== "" });
  const isTokenValid = validation?.valid === true;

  const navigate = useNavigate();

  const { mutate: resetPassword, isPending: isResetting } = useResetPassword({
    onSuccess: () => navigate(PATHS.login, { replace: true }),
  });

  function handleSubmit(values: ResetPasswordFormOutput) {
    resetPassword({ body: { token, password: values.password } });
  }

  return (
    <ResetPasswordView
      isValidating={isValidating}
      isTokenValid={isTokenValid}
      isSubmitting={isResetting}
      onSubmit={handleSubmit}
      onRequestNewLink={() => navigate(PATHS.forgotPassword)}
      onBackToSignIn={() => navigate(PATHS.login)}
    />
  );
}
