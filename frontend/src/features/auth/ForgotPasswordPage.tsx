import { useForgotPassword } from "@/api/services/useAuthService";
import { PATHS } from "@/app/routing/paths";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ForgotPasswordFormOutput } from "./authForms";
import { ForgotPasswordView } from "./ForgotPasswordView";

export function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: forgotPassword, isPending: isSending } = useForgotPassword({
    onSuccess: () => setIsSubmitted(true),
  });

  const navigate = useNavigate();

  function handleSubmit(values: ForgotPasswordFormOutput) {
    forgotPassword({ body: values });
  }

  return (
    <ForgotPasswordView
      isSubmitted={isSubmitted}
      isSubmitting={isSending}
      onSubmit={handleSubmit}
      onBackToSignIn={() => navigate(PATHS.login)}
    />
  );
}
