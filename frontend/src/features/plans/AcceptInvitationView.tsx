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
import { buildRoleLabels } from "./utils/planLabels";
import { Trans, useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const roleLabels = buildRoleLabels(t);

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
              <CardTitle>{t("plans.acceptInvitationView.invalidInvitation")}</CardTitle>
              <CardDescription>
                {t("plans.acceptInvitationView.thisInvitationDoesnTExist")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={onGoHome}>
                <XIcon className="h-4 w-4" />
                {t("plans.acceptInvitationView.backToHome")}
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>{t("plans.acceptInvitationView.youVeBeenInvited")}</CardTitle>
              <CardDescription>
                <Trans
                  i18nKey="plans.acceptInvitationView.invitedYou"
                  values={{
                    inviter: preview.invitedByName,
                    plan: preview.planName,
                    role: roleLabels[preview.role],
                  }}
                  components={{ plan: <Text variant="label" className="text-foreground" /> }}
                />
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" type="button" disabled={isAccepting} onClick={onGoHome}>
                <XIcon className="h-4 w-4" />
                {t("plans.acceptInvitationView.decline")}
              </Button>
              <Button type="button" isLoading={isAccepting} onClick={onAccept}>
                <CheckIcon className="h-4 w-4" />
                {t("plans.acceptInvitationView.acceptInvitation")}
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
