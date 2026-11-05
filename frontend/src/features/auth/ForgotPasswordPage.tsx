import { useForgotPassword } from "@/api/services/useAuthService";
import { PATHS } from "@/app/routing/paths";
import { i18n } from "@/i18n/i18n";
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
    // The e-mail follows the saved language, else the page that asked.
    forgotPassword({ body: { ...values, language: i18n.language } });
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
