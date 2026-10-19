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
import { ROLE_LABELS, ROLE_OPTIONS } from "../utils/planLabels";
import {
  INVITE_FORM_DEFAULTS,
  type InviteFormOutput,
  type InviteFormValues,
  inviteSchema,
} from "./inviteForm";

const TYPE_LABELS: Record<InvitationType, string> = {
  EMAIL: "Email",
  LINK: "Link",
};

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
  const { control, handleSubmit, reset } = useForm<
    InviteFormValues,
    unknown,
    InviteFormOutput
  >({
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
          <DialogTitle>Invite to plan</DialogTitle>
        </DialogHeader>

        {createdInvitation ? (
          <div className="flex flex-col gap-3">
            {createdInvitation.type === "LINK" ? (
              <>
                <Text as="p" variant="secondary">
                  Share this link to invite someone:
                </Text>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    aria-label="Invitation link"
                    value={invitationLink ?? ""}
                    onFocus={(e) => e.target.select()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Copy link"
                    onClick={onCopyLink}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Text as="p" variant="secondary">
                Invitation sent to{" "}
                <Text variant="label" className="text-foreground">
                  {createdInvitation.email}
                </Text>
                .
              </Text>
            )}

            <DialogFooter>
              <Button type="button" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <FormField control={control} name="type" label="Invitation type">
              {(field) => (
                <Select
                  items={TYPE_LABELS}
                  value={field.value}
                  onValueChange={field.onChange}
                >
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
                    <SelectItem value="EMAIL">Email</SelectItem>
                    <SelectItem value="LINK">Link</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </FormField>

            <FormField control={control} name="role" label="Role">
              {(field) => (
                <Select
                  items={ROLE_LABELS}
                  value={field.value}
                  onValueChange={field.onChange}
                >
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
                        {ROLE_LABELS[option]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>

            {type === "EMAIL" && (
              <FormField control={control} name="email" label="Email">
                {(field) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="person@email.com"
                    disabled={isCreating}
                  />
                )}
              </FormField>
            )}

            {type === "LINK" && (
              <FormField
                control={control}
                name="expiresAt"
                label="Expires at (optional)"
              >
                {(field) => (
                  <Input {...field} type="datetime-local" disabled={isCreating} />
                )}
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
                Cancel
              </Button>
              <Button
                type="button"
                isLoading={isCreating}
                onClick={handleSubmit(onCreate)}
              >
                <SendIcon className="h-4 w-4" />
                {type === "LINK" ? "Generate link" : "Send invitation"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
