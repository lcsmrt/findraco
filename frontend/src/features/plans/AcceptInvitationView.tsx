import type { InvitationPreview } from "@/api/dtos";
import { Button } from "@/components/button/base/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card/base/Card";
import { Spinner } from "@/components/spinner/base/Spinner";
import { Text } from "@/components/typography/base/Text";
import { CheckIcon, XIcon } from "lucide-react";
import { ROLE_LABELS } from "./utils/planLabels";

type AcceptInvitationViewProps = {
  preview: InvitationPreview | undefined;
  isLoading: boolean;
  isError: boolean;
  isAccepting: boolean;
  onAccept: () => void;
  /** Back to home: the way out of an invalid invitation and the decline action. */
  onGoHome: () => void;
};

export function AcceptInvitationView({
  preview,
  isLoading,
  isError,
  isAccepting,
  onAccept,
  onGoHome,
}: AcceptInvitationViewProps) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 p-4">
      <Card>
        {isLoading ? (
          <CardContent className="flex justify-center py-10">
            <Spinner />
          </CardContent>
        ) : isError || !preview ? (
          <>
            <CardHeader>
              <CardTitle>Invalid invitation</CardTitle>
              <CardDescription>
                This invitation doesn't exist or is no longer available.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={onGoHome}>
                <XIcon className="h-4 w-4" />
                Back to home
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>You've been invited</CardTitle>
              <CardDescription>
                {preview.invitedByName} invited you to the plan{" "}
                <Text variant="label" className="text-foreground">
                  {preview.planName}
                </Text>{" "}
                as {ROLE_LABELS[preview.role]}.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
                variant="outline"
                type="button"
                disabled={isAccepting}
                onClick={onGoHome}
              >
                <XIcon className="h-4 w-4" />
                Decline
              </Button>
              <Button
                type="button"
                isLoading={isAccepting}
                onClick={onAccept}
              >
                <CheckIcon className="h-4 w-4" />
                Accept invitation
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
