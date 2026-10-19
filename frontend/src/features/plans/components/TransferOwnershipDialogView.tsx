import type { PlanMember } from "@/api/dtos";
import { Button } from "@/components/button/base/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/base/Dialog";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/input/base/Field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/input/base/Select";
import { Spinner } from "@/components/spinner/base/Spinner";
import { Text } from "@/components/typography/base/Text";
import { ArrowRightLeftIcon, XIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";

type TransferOwnershipDialogViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Members who can receive ownership (everyone but the owners). */
  candidates: PlanMember[];
  isLoading: boolean;
  isTransferring: boolean;
  onTransfer: (newOwnerUserId: number) => void;
};

export function TransferOwnershipDialogView({
  open,
  onOpenChange,
  candidates,
  isLoading,
  isTransferring,
  onTransfer,
}: TransferOwnershipDialogViewProps) {
  const ownerFieldId = useId();
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  useEffect(() => {
    setSelectedUserId("");
  }, [open]);

  function handleTransfer() {
    if (!selectedUserId) return;
    onTransfer(Number(selectedUserId));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Transfer ownership</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : candidates.length === 0 ? (
          <Text as="p" variant="secondary" className="py-6 text-center">
            There are no other members to transfer ownership to.
          </Text>
        ) : (
          <Field>
            <FieldLabel htmlFor={ownerFieldId}>New owner</FieldLabel>
            <Select
              value={selectedUserId}
              onValueChange={(value) => setSelectedUserId(value ?? "")}
            >
              <SelectTrigger id={ownerFieldId} className="w-full">
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((member) => (
                  <SelectItem
                    key={member.userId}
                    value={String(member.userId)}
                  >
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              You will become an Editor of this plan.
            </FieldDescription>
          </Field>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            disabled={isTransferring}
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="button"
            isLoading={isTransferring}
            disabled={!selectedUserId || candidates.length === 0}
            onClick={handleTransfer}
          >
            <ArrowRightLeftIcon className="h-4 w-4" />
            Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
