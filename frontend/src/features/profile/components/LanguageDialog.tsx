import type { UserLanguage } from "@/api/dtos";
import { useUpdateLanguage } from "@/api/services/useAuthService";
import { SOURCE_LANGUAGE } from "@/i18n/languages";
import { useTranslation } from "react-i18next";
import { LanguageDialogView } from "./LanguageDialogView";

type LanguageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LanguageDialog({ open, onOpenChange }: LanguageDialogProps) {
  const { i18n } = useTranslation();
  // A failed save keeps the pick on screen for the session; the service shows the problem copy.
  const { mutate: updateLanguage } = useUpdateLanguage();

  function handlePick(language: UserLanguage) {
    void i18n.changeLanguage(language);
    updateLanguage({ body: { language } });
  }

  return (
    <LanguageDialogView
      open={open}
      onOpenChange={onOpenChange}
      value={i18n.resolvedLanguage === "pt-BR" ? "pt-BR" : SOURCE_LANGUAGE}
      onPick={handlePick}
    />
  );
}
