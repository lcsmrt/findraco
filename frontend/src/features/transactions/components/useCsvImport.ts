import { useImportNubankCsv } from "@/api/services/useTransactionService";

/**
 * Imports a Nubank CSV export into the active plan. The service shows the result toast and refreshes
 * the transaction list; rows the plan already has are skipped by the API, not here.
 */
export function useCsvImport() {
  const { mutate, isPending } = useImportNubankCsv();

  function importCsv(file: File) {
    mutate(file);
  }

  return { importCsv, isImporting: isPending };
}
