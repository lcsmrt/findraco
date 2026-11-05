import { Share } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/base/Dialog";
import { Text } from "@/components/typography/base/Text";
import { useTranslation } from "react-i18next";

type InstallInstructionsDialogViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// iOS never offers installation itself, so the only way in is the Share sheet; this tells where to look.
export function InstallInstructionsDialogView({
  open,
  onOpenChange,
}: InstallInstructionsDialogViewProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="gap-4">
          <DialogTitle>{t("app.installInstructionsDialogView.installFindraco")}</DialogTitle>
          <DialogDescription>
            {t("app.installInstructionsDialogView.addFindracoToYourHome")}
          </DialogDescription>
        </DialogHeader>
        <ol className="flex list-decimal flex-col gap-3 pl-5">
          <li>
            <Text className="inline-flex items-center gap-1.5">
              {t("app.installInstructionsDialogView.tapTheShareIcon")}
              <Share aria-hidden className="size-4" />
              {t("app.installInstructionsDialogView.inTheBrowserToolbar")}
            </Text>
          </li>
          <li>
            <Text>{t("app.installInstructionsDialogView.chooseAddToHomeScreen")}</Text>
          </li>
        </ol>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
