import type { PlanMember } from "@/api/dtos";
import { Button } from "@/components/button/base/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/base/Dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/input/base/Field";
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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
          <DialogTitle>{t("plans.transferOwnershipDialogView.transferOwnership")}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : candidates.length === 0 ? (
          <Text as="p" variant="secondary" className="py-6 text-center">
            {t("plans.transferOwnershipDialogView.thereAreNoOtherMembers")}
          </Text>
        ) : (
          <Field>
            <FieldLabel htmlFor={ownerFieldId}>
              {t("plans.transferOwnershipDialogView.newOwner")}
            </FieldLabel>
            <Select
              value={selectedUserId}
              onValueChange={(value) => setSelectedUserId(value ?? "")}
            >
              <SelectTrigger id={ownerFieldId} className="w-full">
                <SelectValue placeholder={t("plans.transferOwnershipDialogView.selectAMember")} />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((member) => (
                  <SelectItem key={member.userId} value={String(member.userId)}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              {t("plans.transferOwnershipDialogView.youWillBecomeAnEditor")}
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
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            isLoading={isTransferring}
            disabled={!selectedUserId || candidates.length === 0}
            onClick={handleTransfer}
          >
            <ArrowRightLeftIcon className="h-4 w-4" />
            {t("plans.transferOwnershipDialogView.transfer")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
