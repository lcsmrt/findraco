import { i18n } from "@/i18n/i18n";
import type { ImportResultResponse } from "../dtos";

function transactions(count: number) {
  return i18n.t("api.importResult.transactions", { count });
}

/** The toast after an import: what was stored and what the plan already had. */
export function importResultMessage({
  imported,
  skippedDuplicates,
}: ImportResultResponse): string {
  if (imported === 0) {
    return skippedDuplicates === 0
      ? i18n.t("api.importResult.empty")
      : i18n.t("api.importResult.nothingNew", { transactions: transactions(skippedDuplicates) });
  }
  return skippedDuplicates === 0
    ? i18n.t("api.importResult.imported", { transactions: transactions(imported) })
    : i18n.t("api.importResult.importedWithSkips", {
        transactions: transactions(imported),
        skipped: skippedDuplicates,
      });
}
