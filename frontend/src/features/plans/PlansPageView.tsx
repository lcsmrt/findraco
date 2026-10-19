import type { ReactNode } from "react";
import type { Plan } from "@/api/dtos";
import { Badge } from "@/components/badge/base/Badge";
import { Button } from "@/components/button/base/Button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/card/base/Card";
import { PageHeader } from "@/components/pageHeader/PageHeader";
import { Spinner } from "@/components/spinner/base/Spinner";
import { Text } from "@/components/typography/base/Text";
import { cn } from "@/lib/mergeClasses";
import {
  ArchiveIcon,
  ArrowLeftIcon,
  ArrowRightLeftIcon,
  CheckIcon,
  LogOutIcon,
  PencilIcon,
  PlusIcon,
  UserPlusIcon,
} from "lucide-react";
import { ROLE_LABELS } from "./utils/planLabels";

type PlansPageViewProps = {
  plans: Plan[];
  activePlan: Plan | undefined;
  activePlanId: number | null;
  isLoading: boolean;
  /** Owners rename, transfer, archive and invite; everyone else may only leave. */
  canManagePlan: boolean;
  isArchiving: boolean;
  isLeaving: boolean;
  onBack: () => void;
  onCreatePlan: () => void;
  onSelectPlan: (planId: number) => void;
  onRename: () => void;
  onTransferOwnership: () => void;
  onArchive: () => void;
  onInvite: () => void;
  onLeave: () => void;
  // Slots: both lists load their own data for the active plan.
  membersList: ReactNode;
  invitationsList: ReactNode;
};

export function PlansPageView({
  plans,
  activePlan,
  activePlanId,
  isLoading,
  canManagePlan,
  isArchiving,
  isLeaving,
  onBack,
  onCreatePlan,
  onSelectPlan,
  onRename,
  onTransferOwnership,
  onArchive,
  onInvite,
  onLeave,
  membersList,
  invitationsList,
}: PlansPageViewProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
      <Button
        variant="ghost"
        size="sm"
        className="self-start"
        onClick={onBack}
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </Button>

      <PageHeader
        title="Plans"
        description="Manage your plans and switch between them."
        actions={
          <Button size="sm" onClick={onCreatePlan}>
            <PlusIcon className="h-4 w-4" />
            New plan
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {plans.map((plan) => {
            const isActive = plan.id === activePlanId;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => onSelectPlan(plan.id)}
                className={cn(
                  "border-border bg-card hover:border-primary/50 flex flex-col gap-2 rounded-lg border p-4 text-left transition-colors",
                  isActive && "border-primary ring-primary/30 ring-1",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <Text variant="title">{plan.name}</Text>
                  {isActive && <CheckIcon className="text-primary-ink h-4 w-4" />}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary">{ROLE_LABELS[plan.myRole]}</Badge>
                  {plan.isDefault && <Badge variant="outline">Default</Badge>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {activePlan && (
        <Card>
          <CardHeader>
            <CardTitle>Members of {activePlan.name}</CardTitle>
            <CardAction className="flex items-center gap-2">
              {canManagePlan ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Rename plan"
                    onClick={onRename}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Transfer ownership"
                    onClick={onTransferOwnership}
                  >
                    <ArrowRightLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:bg-accent hover:text-destructive"
                    aria-label="Archive plan"
                    isLoading={isArchiving}
                    disabled={isArchiving}
                    onClick={onArchive}
                  >
                    <ArchiveIcon className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={onInvite}>
                    <UserPlusIcon className="h-4 w-4" />
                    Invite
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  isLoading={isLeaving}
                  disabled={isLeaving}
                  onClick={onLeave}
                >
                  <LogOutIcon className="h-4 w-4" />
                  Leave plan
                </Button>
              )}
            </CardAction>
          </CardHeader>
          <CardContent>
            {membersList}
          </CardContent>
        </Card>
      )}

      {activePlan && canManagePlan && (
        <Card>
          <CardHeader>
            <CardTitle>Invitations for {activePlan.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {invitationsList}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
