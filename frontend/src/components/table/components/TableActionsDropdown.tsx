import { cn } from "@/lib/mergeClasses";
import type { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown/base/Dropdown";
import { EllipsisVertical } from "lucide-react";

export type ColumnAction<T> = {
  label: string;
  onClick: (row: Row<T>) => void;
  icon?: React.ReactNode;
  conditionalRenderingFunctions?: ((original: T) => boolean)[];
};

type ColumnActionDropdownProps<T> = {
  columnActions?: ColumnAction<T>[];
  row: Row<T>;
  subtle?: boolean;
};

export function TableActionsDropdown<T>({ columnActions, row, subtle }: ColumnActionDropdownProps<T>) {
  const filteredActions = columnActions?.filter((action) => {
    if (!action.conditionalRenderingFunctions) return true;
    return action.conditionalRenderingFunctions.every((fn) => fn(row.original));
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Row actions"
        className="hover:bg-muted-foreground/10 flex h-7 w-7 items-center justify-center rounded-full">
        <EllipsisVertical
          className={cn(
            "inline-block h-4 w-4",
            subtle && "text-muted-foreground/50 hover:text-foreground",
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {filteredActions?.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => action.onClick(row)}
          >
            <div className="flex w-full items-center gap-2 hover:cursor-pointer">
              {action.icon}
              {action.label}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
