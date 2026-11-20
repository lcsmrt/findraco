import type { NeutralCandidate } from "@/api/dtos";
import {
  useGetNeutralCandidates,
  useSetTransactionKind,
} from "@/api/services/useTransactionService";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/sheet/base/Sheet";
import { useTranslation } from "react-i18next";
import { NeutralReviewListView } from "./NeutralReviewListView";

// Applying a row takes it out of the list, so the next ones come in; one page is enough to work through.
const REVIEW_PAGE = { page: 0, size: 50 };
const NO_CANDIDATES: NeutralCandidate[] = [];

type NeutralReviewSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * "Review movements": the rows with no kind that look like a transfer between members or a card
 * bill payment. Applying one sets the kind it proposes, and the totals follow at once.
 */
export function NeutralReviewSheet({ open, onOpenChange }: NeutralReviewSheetProps) {
  const { t } = useTranslation();

  const { data, isLoading, isError, refetch } = useGetNeutralCandidates(REVIEW_PAGE, {
    enabled: open,
  });
  const setKind = useSetTransactionKind();

  function handleApply({ transaction, proposedKind }: NeutralCandidate) {
    setKind.mutate({
      params: { id: transaction.id },
      body: { kind: proposedKind, version: transaction.version },
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Full width on a phone, a side panel from `sm`. */}
      <SheetContent className="data-[side=right]:w-full sm:data-[side=right]:w-3/4">
        <SheetHeader>
          <SheetTitle>{t("transactions.neutralReviewSheet.reviewMovements")}</SheetTitle>
          <SheetDescription>{t("transactions.neutralReviewSheet.description")}</SheetDescription>
        </SheetHeader>
        <NeutralReviewListView
          candidates={data?.content ?? NO_CANDIDATES}
          total={data?.totalElements ?? 0}
          isLoading={isLoading}
          isError={isError}
          applyingId={setKind.isPending ? (setKind.variables?.params.id ?? null) : null}
          onApply={handleApply}
          onRetry={() => void refetch()}
        />
      </SheetContent>
    </Sheet>
  );
}
