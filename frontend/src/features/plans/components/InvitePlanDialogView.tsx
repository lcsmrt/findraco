import type { Invitation, InvitationType } from "@/api/dtos";
import { Button } from "@/components/button/base/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/base/Dialog";
import { FormField } from "@/components/form/FormField";
import { Input } from "@/components/input/base/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/input/base/Select";
import { Text } from "@/components/typography/base/Text";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyIcon, SendIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { buildRoleLabels, ROLE_OPTIONS } from "../utils/planLabels";
import {
  INVITE_FORM_DEFAULTS,
  type InviteFormOutput,
  type InviteFormValues,
  inviteSchema,
} from "./inviteForm";
import { Trans, useTranslation } from "react-i18next";

type InvitePlanDialogViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Once set, the dialog shows the result instead of the form. */
  createdInvitation: Invitation | null;
  /** The absolute link of a created link invitation. */
  invitationLink: string | null;
  isCreating: boolean;
  onCreate: (values: InviteFormOutput) => void;
  onCopyLink: () => void;
};

export function InvitePlanDialogView({
  open,
  onOpenChange,
  createdInvitation,
  invitationLink,
  isCreating,
  onCreate,
  onCopyLink,
}: InvitePlanDialogViewProps) {
  const { t } = useTranslation();
  const typeLabels: Record<InvitationType, string> = {
    EMAIL: t("plans.invitePlanDialogView.typeEmail"),
    LINK: t("plans.invitePlanDialogView.typeLink"),
  };
  const roleLabels = buildRoleLabels(t);

  const { control, handleSubmit, reset } = useForm<InviteFormValues, unknown, InviteFormOutput>({
    resolver: zodResolver(inviteSchema),
    defaultValues: INVITE_FORM_DEFAULTS,
  });

  useEffect(() => {
    reset(INVITE_FORM_DEFAULTS);
  }, [open, reset]);

  const type = useWatch({ control, name: "type" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("plans.invitePlanDialogView.inviteToPlan")}</DialogTitle>
        </DialogHeader>

        {createdInvitation ? (
          <div className="flex flex-col gap-3">
            {createdInvitation.type === "LINK" ? (
              <>
                <Text as="p" variant="secondary">
                  {t("plans.invitePlanDialogView.shareThisLinkToInvite")}
                </Text>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    aria-label={t("plans.invitePlanDialogView.invitationLink")}
                    value={invitationLink ?? ""}
                    onFocus={(e) => e.target.select()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={t("plans.invitePlanDialogView.copyLink")}
                    onClick={onCopyLink}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Text as="p" variant="secondary">
                <Trans
                  i18nKey="plans.invitePlanDialogView.sentTo"
                  values={{ email: createdInvitation.email }}
                  components={{ email: <Text variant="label" className="text-foreground" /> }}
                />
              </Text>
            )}

            <DialogFooter>
              <Button type="button" onClick={() => onOpenChange(false)}>
                {t("plans.invitePlanDialogView.done")}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <FormField
              control={control}
              name="type"
              label={t("plans.invitePlanDialogView.invitationType")}
            >
              {(field) => (
                <Select items={typeLabels} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id={field.id}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    aria-invalid={field["aria-invalid"]}
                    className="w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMAIL">{t("common.email")}</SelectItem>
                    <SelectItem value="LINK">{t("plans.invitePlanDialogView.link")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </FormField>

            <FormField control={control} name="role" label={t("plans.invitePlanDialogView.role")}>
              {(field) => (
                <Select items={roleLabels} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id={field.id}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    aria-invalid={field["aria-invalid"]}
                    className="w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {roleLabels[option]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>

            {type === "EMAIL" && (
              <FormField control={control} name="email" label={t("common.email")}>
                {(field) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder={t("plans.invitePlanDialogView.personEmailCom")}
                    disabled={isCreating}
                  />
                )}
              </FormField>
            )}

            {type === "LINK" && (
              <FormField
                control={control}
                name="expiresAt"
                label={t("plans.invitePlanDialogView.expiresAtOptional")}
              >
                {(field) => <Input {...field} type="datetime-local" disabled={isCreating} />}
              </FormField>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                disabled={isCreating}
                onClick={() => onOpenChange(false)}
              >
                <XIcon className="h-4 w-4" />
                {t("common.cancel")}
              </Button>
              <Button type="button" isLoading={isCreating} onClick={handleSubmit(onCreate)}>
                <SendIcon className="h-4 w-4" />
                {type === "LINK"
                  ? t("plans.invitePlanDialogView.generateLink")
                  : t("plans.invitePlanDialogView.sendInvitation")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
