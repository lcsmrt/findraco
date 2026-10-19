import type { PlanMember, PlanRole } from "@/api/dtos";
import { Avatar, AvatarFallback } from "@/components/avatar/base/Avatar";
import { Badge } from "@/components/badge/base/Badge";
import { Button } from "@/components/button/base/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/input/base/Select";
import { Spinner } from "@/components/spinner/base/Spinner";
import { Text } from "@/components/typography/base/Text";
import { cn } from "@/lib/mergeClasses";
import { getFirstAndLastInitials } from "@/utils/string/formatters";
import { Trash2Icon } from "lucide-react";
import { ROLE_LABELS, ROLE_OPTIONS } from "../utils/planLabels";

type PlanMembersListViewProps = {
  members: PlanMember[];
  isLoading: boolean;
  /** Whether the viewer may change this member's role or remove them. */
  canManageMember: (member: PlanMember) => boolean;
  onRoleChange: (member: PlanMember, role: PlanRole) => void;
  onRemove: (member: PlanMember) => void;
};

export function PlanMembersListView({
  members,
  isLoading,
  canManageMember,
  onRoleChange,
  onRemove,
}: PlanMembersListViewProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <Text as="p" variant="secondary" className="py-6 text-center">
        No members in this plan.
      </Text>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {members.map((member) => (
        <li
          key={member.userId}
          className={cn(
            "border-border flex items-center justify-between gap-3 rounded-lg border p-3",
            // The role select does not fit beside a long name on a phone, so it drops below.
            canManageMember(member) && "flex-col items-stretch sm:flex-row sm:items-center",
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {getFirstAndLastInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <Text variant="label" className="truncate">
                {member.name}
              </Text>
              <Text variant="caption" className="truncate">
                {member.email}
              </Text>
            </div>
          </div>

          {canManageMember(member) ? (
            <div className="flex shrink-0 items-center justify-end gap-2">
              <Select
                value={member.role}
                items={ROLE_LABELS}
                onValueChange={(value) => {
                  if (value !== null) {
                    onRoleChange(member, value);
                  }
                }}
              >
                <SelectTrigger
                  className="h-8 w-[150px]"
                  aria-label={`Role of ${member.name}`}
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
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-muted-foreground hover:bg-accent hover:text-destructive rounded"
                aria-label={`Remove ${member.name}`}
                onClick={() => onRemove(member)}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Badge variant="secondary" className="shrink-0">
              {ROLE_LABELS[member.role]}
            </Badge>
          )}
        </li>
      ))}
    </ul>
  );
}
