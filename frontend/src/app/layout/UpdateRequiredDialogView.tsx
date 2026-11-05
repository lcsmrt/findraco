import { Button } from "@/components/button/base/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/base/Dialog";
import { useTranslation } from "react-i18next";

type UpdateRequiredDialogViewProps = {
  onUpdate: () => void;
};

export function UpdateRequiredDialogView({ onUpdate }: UpdateRequiredDialogViewProps) {
  const { t } = useTranslation();

  return (
    // Controlled open with a no-op change handler: Escape and an outside click request a close that
    // is ignored, so the only way out is the update.
    <Dialog open onOpenChange={() => undefined}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="gap-4">
          <DialogTitle>{t("app.updateRequiredDialogView.updateRequired")}</DialogTitle>
          <DialogDescription>
            {t("app.updateRequiredDialogView.aNewVersionOfFindraco")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onUpdate}>{t("app.updateRequiredDialogView.update")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
