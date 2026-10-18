import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/Dialog";
import { Button } from "@/components/button/Button";
import { ConfirmDialogContext, type ConfirmOptions } from "./useConfirm";

export const ConfirmDialogProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
    null,
  );

  const confirm = (opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    resolver?.(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    resolver?.(false);
    setIsOpen(false);
  };

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
                {options.cancelLabel || "Cancel"}
              </Button>
              <Button
                variant={options.variant || "default"}
                onClick={handleConfirm}
              >
                {options.confirmLabel || "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ConfirmDialogContext.Provider>
  );
};
