import { Invitation, InvitationType } from "@/api/dtos";
import { useCreateInvitation } from "@/api/services/useInvitationService";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyIcon, SendIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { ROLE_LABELS, ROLE_OPTIONS } from "../utils/planLabels";
import {
  INVITE_FORM_DEFAULTS,
  InviteFormOutput,
  InviteFormValues,
  inviteSchema,
  toInvitePayload,
} from "./inviteForm";

const TYPE_LABELS: Record<InvitationType, string> = {
  EMAIL: "Email",
  LINK: "Link",
};

type InvitePlanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: number;
};

const buildInvitationLink = (invitation: Invitation): string => {
  const relative = invitation.link ?? `/invitation/${invitation.token}`;
  return `${window.location.origin}${relative}`;
};

export const InvitePlanDialog = ({
  open,
  onOpenChange,
  planId,
}: InvitePlanDialogProps) => {
  const [createdInvitation, setCreatedInvitation] = useState<Invitation | null>(
    null,
  );

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
    setCreatedInvitation(null);
  }, [open, reset]);

  const { mutate: createInvitation, isPending } = useCreateInvitation({
    onSuccess: (invitation) => setCreatedInvitation(invitation),
  });

  const type = useWatch({ control, name: "type" });

  const onSubmit = (values: InviteFormOutput) => {
    createInvitation({ params: { planId }, body: toInvitePayload(values) });
  };

  const copyLink = () => {
    if (!createdInvitation) return;
    navigator.clipboard.writeText(buildInvitationLink(createdInvitation));
    toast.success("Link copied to clipboard.");
  };

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
                <p className="text-muted-foreground text-sm">
                  Share this link to invite someone:
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={buildInvitationLink(createdInvitation)}
                    onFocus={(e) => e.target.select()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyLink}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Invitation sent to{" "}
                <span className="text-foreground font-medium">
                  {createdInvitation.email}
                </span>
                .
              </p>
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
                    disabled={isPending}
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
                  <Input {...field} type="datetime-local" disabled={isPending} />
                )}
              </FormField>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                disabled={isPending}
                onClick={() => onOpenChange(false)}
              >
                <XIcon className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="button"
                isLoading={isPending}
                onClick={handleSubmit(onSubmit)}
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
};
