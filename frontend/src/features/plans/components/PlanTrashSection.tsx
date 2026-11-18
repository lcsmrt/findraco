import {
  useGetTransactionTrash,
  useRestoreDeletion,
} from "@/api/services/useTransactionService";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { PlanTrashListView } from "./PlanTrashListView";

// One page covers a month of heavy cleaning; the purge empties the trash after 30 days anyway.
const TRASH_PAGE = { page: 0, size: 50 };

/** The active plan's trash card; absent for a viewer, who may not restore, and while loading. */
export function PlanTrashSection() {
  const { activePlan } = usePlanContext();
  const isViewer = activePlan?.myRole === "VIEWER";
  const { data, isLoading, isError, refetch } = useGetTransactionTrash(TRASH_PAGE, {
    enabled: !isViewer,
  });
  const restore = useRestoreDeletion();

  if (isViewer || isLoading) return null;

  return (
    <PlanTrashListView
      entries={data?.content ?? []}
      isError={isError}
      restoringId={restore.isPending ? restore.variables : null}
      onRestore={(entry) => restore.mutate(entry.id)}
      onRetry={() => void refetch()}
    />
  );
}
