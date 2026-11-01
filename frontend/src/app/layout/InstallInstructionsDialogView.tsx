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

type InstallInstructionsDialogViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// iOS never offers installation itself, so the only way in is the Share sheet; this tells where to look.
export function InstallInstructionsDialogView({
  open,
  onOpenChange,
}: InstallInstructionsDialogViewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="gap-4">
          <DialogTitle>Install findraco</DialogTitle>
          <DialogDescription>Add findraco to your home screen in two steps.</DialogDescription>
        </DialogHeader>
        <ol className="flex list-decimal flex-col gap-3 pl-5">
          <li>
            <Text className="inline-flex items-center gap-1.5">
              Tap the Share icon
              <Share aria-hidden className="size-4" />
              in the browser toolbar.
            </Text>
          </li>
          <li>
            <Text>Choose &quot;Add to Home Screen&quot;.</Text>
          </li>
        </ol>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
