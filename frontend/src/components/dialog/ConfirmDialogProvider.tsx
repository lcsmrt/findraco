import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/base/Dialog";
import { Button } from "@/components/button/base/Button";
import { ConfirmDialogContext, type ConfirmOptions } from "./useConfirm";
import { useTranslation } from "react-i18next";

export function ConfirmDialogProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
    null,
  );

  function confirm(opts: ConfirmOptions): Promise<boolean> {
    setOptions(opts);
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  }

  function handleConfirm() {
    resolver?.(true);
    setIsOpen(false);
  }

  function handleCancel() {
    resolver?.(false);
    setIsOpen(false);
  }

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      {options && (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
          <DialogContent>
            <DialogHeader className="gap-4">
              <DialogTitle>{options.title}</DialogTitle>
              <DialogDescription>{options.description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={handleCancel}>
                {options.cancelLabel || t("common.cancel")}
              </Button>
              <Button
                variant={options.variant || "default"}
                onClick={handleConfirm}
              >
                {options.confirmLabel || t("common.confirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ConfirmDialogContext.Provider>
  );
}
