import type { Plan } from "@/api/dtos";
import { Button } from "@/components/button/base/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown/base/Dropdown";
import { ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

type PlanSwitcherViewProps = {
  plans: Plan[];
  activePlanId: number | null;
  activePlanName: string | undefined;
  onSelectPlan: (planId: number) => void;
  onCreatePlan: () => void;
};

export function PlanSwitcherView({
  plans,
  activePlanId,
  activePlanName,
  onSelectPlan,
  onCreatePlan,
}: PlanSwitcherViewProps) {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="max-w-52 justify-between gap-2">
            <span className="truncate">{activePlanName ?? t("plans.planSwitcherView.selectPlan")}</span>
            <ChevronsUpDownIcon className="text-muted-foreground" />
          </Button>
        }
      />

      <DropdownMenuContent className="min-w-52" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("plans.planSwitcherView.plans")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={activePlanId != null ? String(activePlanId) : ""}
            onValueChange={(value) => onSelectPlan(Number(value))}
          >
            {plans.map((plan) => (
              <DropdownMenuRadioItem key={plan.id} value={String(plan.id)}>
                <span className="truncate">{plan.name}</span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onCreatePlan}>
          <PlusIcon />
          {t("plans.planSwitcherView.newPlan")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
