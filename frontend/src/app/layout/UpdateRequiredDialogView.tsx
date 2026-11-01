import { Button } from "@/components/button/base/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/base/Dialog";

type UpdateRequiredDialogViewProps = {
  onUpdate: () => void;
};

export function UpdateRequiredDialogView({ onUpdate }: UpdateRequiredDialogViewProps) {
  return (
    // Controlled open with a no-op change handler: Escape and an outside click request a close that
    // is ignored, so the only way out is the update.
    <Dialog open onOpenChange={() => undefined}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="gap-4">
          <DialogTitle>Update required</DialogTitle>
          <DialogDescription>A new version of findraco is needed to continue.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
