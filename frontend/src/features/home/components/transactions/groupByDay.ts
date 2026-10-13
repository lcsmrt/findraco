import type { FinancialTransaction } from "@/api/dtos/financialTransaction";

export type TransactionDay = {
  /** Calendar day, `yyyy-MM-dd`, as stored (no timezone conversion). */
  day: string;
  transactions: FinancialTransaction[];
};

/**
 * Groups a page of transactions by calendar day (UX-02 AC 4). Days appear in the
 * order of their first transaction on the page; rows keep their page order.
 */
export const groupByDay = (
  transactions: FinancialTransaction[],
): TransactionDay[] => {
  const groups = new Map<string, FinancialTransaction[]>();
  transactions.forEach((transaction) => {
    const day = transaction.startDate.split("T")[0];
    const group = groups.get(day);
    if (group) group.push(transaction);
    else groups.set(day, [transaction]);
  });
  return Array.from(groups, ([day, rows]) => ({ day, transactions: rows }));
};
