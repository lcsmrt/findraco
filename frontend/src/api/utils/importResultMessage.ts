import type { ImportResultResponse } from "../dtos";

function transactions(count: number) {
  return count === 1 ? "1 transaction" : `${count} transactions`;
}

/** The toast after an import: what was stored and what the plan already had. */
export function importResultMessage({
  imported,
  skippedDuplicates,
}: ImportResultResponse): string {
  if (imported === 0) {
    return skippedDuplicates === 0
      ? "The file has no transactions."
      : `Nothing new to import: ${transactions(skippedDuplicates)} already in the plan.`;
  }
  return skippedDuplicates === 0
    ? `Imported ${transactions(imported)}.`
    : `Imported ${transactions(imported)}; ${skippedDuplicates} already in the plan were skipped.`;
}
