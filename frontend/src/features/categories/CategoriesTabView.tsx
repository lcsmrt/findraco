import type { FinancialTransactionCategory } from "@/api/dtos";
import { Text } from "@/components/typography/base/Text";
import { Button } from "@/components/button/base/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/card/base/Card";
import { Skeleton } from "@/components/skeleton/base/Skeleton";
import { cn } from "@/lib/mergeClasses";
import { PlusIcon } from "lucide-react";
import type { MemberColorOf } from "@/utils/memberColors";
import type { CategoryTreeRoot, CategoryTreeSection } from "./categoryTree";
import { CATEGORY_GRID_COLUMNS, CategoryTreeRow } from "./components/CategoryTreeRow";

const SECTION_TITLES = { DEBIT: "Expenses", CREDIT: "Income" } as const;

type CategorySectionProps = {
  title: string;
  roots: CategoryTreeRoot[];
  colorOf: MemberColorOf;
  canManage: boolean;
  onEdit: (category: FinancialTransactionCategory) => void;
  onDelete: (category: FinancialTransactionCategory) => void;
  onAddChild: (root: FinancialTransactionCategory) => void;
};

function CategorySection({
  title,
  roots,
  colorOf,
  canManage,
  onEdit,
  onDelete,
  onAddChild,
}: CategorySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {roots.length === 0 ? (
          <Text as="p" variant="secondary" className="flex h-16 items-center justify-center">
            No categories yet.
          </Text>
        ) : (
          <div className="flex flex-col">
            <Text
              as="div"
              variant="caption"
              className={cn("hidden border-b pb-2", CATEGORY_GRID_COLUMNS)}
            >
              <span>Name</span>
              <span>Owner</span>
              <span className="text-right">Monthly limit</span>
              <span>Per member</span>
              <span className="sr-only">Actions</span>
            </Text>
            {roots.map((root) => (
              <div key={root.category.id} className="border-b last:border-0">
                <CategoryTreeRow
                  category={root.category}
                  colorOf={colorOf}
                  canManage={canManage}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAddChild={onAddChild}
                />
                {root.children.map((child, index) => (
                  <CategoryTreeRow
                    key={child.id}
                    category={child}
                    child={{ isLast: index === root.children.length - 1 }}
                    colorOf={colorOf}
                    canManage={canManage}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddChild={onAddChild}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type CategoriesTabViewProps = {
  /** `null` while the categories load. */
  sections: CategoryTreeSection[] | null;
  colorOf: MemberColorOf;
  canManage: boolean;
  onCreate: () => void;
  onEdit: (category: FinancialTransactionCategory) => void;
  onDelete: (category: FinancialTransactionCategory) => void;
  onAddChild: (root: FinancialTransactionCategory) => void;
};

/** Category management: structure and configured limits, no spend. */
export function CategoriesTabView({
  sections,
  colorOf,
  canManage,
  onCreate,
  onEdit,
  onDelete,
  onAddChild,
}: CategoriesTabViewProps) {
  return (
    <div className="flex flex-col gap-6 px-4">
      {canManage && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button onClick={onCreate}>
            <PlusIcon className="h-4 w-4" />
            New Category
          </Button>
        </div>
      )}

      {sections == null ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <CategorySection
              key={section.type}
              title={SECTION_TITLES[section.type]}
              roots={section.roots}
              colorOf={colorOf}
              canManage={canManage}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}
