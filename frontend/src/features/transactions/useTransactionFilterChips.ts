import type {
  FinancialTransactionCategory,
  PagedFinancialTransactionsFilter,
} from "@/api/dtos";
import {
  financialTransactionCategoryKey,
  useGetFinancialTransactionCategory,
} from "@/api/services/useFinancialTransactionCategoryService";
import { useGetPlanMembers } from "@/api/services/usePlanService";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { formatMoney } from "@/utils/money";
import { formatDate } from "@/utils/string/formatters";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useMemo } from "react";
import { useTransactionFilters } from "./filters/useTransactionFilters";

type FilterKey = keyof PagedFinancialTransactionsFilter;

export type FilterChip = { key: string; label: string; onRemove: () => void };

function isNotFound(error: unknown) {
  return isAxiosError(error) && error.response?.status === 404;
}

/**
 * Chips for the active Transactions filters. Member names come from the members
 * query, the category name from the category-by-id query. A filter pointing to a
 * category or member that no longer exists in the plan is dropped from the URL.
 */
export function useTransactionFilterChips() {
  const { transactions, updateTransactions } = useTransactionFilters();
  const { activePlanId } = usePlanContext();
  const queryClient = useQueryClient();
  const { filter } = transactions;

  const { data: members, isSuccess: membersLoaded } = useGetPlanMembers(
    activePlanId ?? undefined,
  );
  const { data: category = null, error: categoryError } =
    useGetFinancialTransactionCategory(filter.categoryId ?? null, {
      // A missing category will not reappear; other errors get the usual single retry.
      retry: (failureCount, error) => !isNotFound(error) && failureCount < 1,
    });

  const planMember =
    filter.memberId != null
      ? members?.find((m) => m.userId === filter.memberId)
      : undefined;
  const member = useMemo(
    () => (planMember ? { id: planMember.userId, name: planMember.name } : null),
    [planMember],
  );

  const removeFilters = useCallback(
    (keys: FilterKey[]) =>
      updateTransactions((t) => {
        const next = { ...t.filter };
        keys.forEach((key) => delete next[key]);
        return { ...t, filter: next };
      }),
    [updateTransactions],
  );

  const isCategoryStale = isNotFound(categoryError);
  const isMemberStale = filter.memberId != null && membersLoaded && !planMember;

  useEffect(() => {
    const stale: FilterKey[] = [];
    if (isCategoryStale) stale.push("categoryId");
    if (isMemberStale) stale.push("memberId");
    if (stale.length > 0) removeFilters(stale);
  }, [isCategoryStale, isMemberStale, removeFilters]);

  const seedCategory = useCallback(
    (picked: FinancialTransactionCategory) =>
      queryClient.setQueryData(
        financialTransactionCategoryKey(activePlanId, picked.id),
        picked,
      ),
    [queryClient, activePlanId],
  );

  const chips = useMemo(() => {
    const result: FilterChip[] = [];

    if (filter.type) {
      result.push({
        key: "type",
        label: filter.type === "CREDIT" ? "Credit" : "Debit",
        onRemove: () => removeFilters(["type"]),
      });
    }
    if (filter.categoryId != null && category) {
      result.push({
        key: "category",
        label: category.description,
        onRemove: () => removeFilters(["categoryId"]),
      });
    }
    if (filter.memberId != null && member) {
      result.push({
        key: "member",
        label: member.name,
        onRemove: () => removeFilters(["memberId"]),
      });
    }
    if (filter.startDateFrom || filter.startDateTo) {
      const from = filter.startDateFrom
        ? formatDate(filter.startDateFrom, "dd/MM/yyyy")
        : null;
      const to = filter.startDateTo
        ? formatDate(filter.startDateTo, "dd/MM/yyyy")
        : null;
      const label =
        from && to ? `${from} – ${to}` : from ? `From ${from}` : `Until ${to!}`;
      result.push({
        key: "date",
        label,
        onRemove: () => removeFilters(["startDateFrom", "startDateTo"]),
      });
    }
    if (filter.amountMin != null || filter.amountMax != null) {
      const min =
        filter.amountMin != null
          ? formatMoney(filter.amountMin)
          : null;
      const max =
        filter.amountMax != null
          ? formatMoney(filter.amountMax)
          : null;
      const label =
        min && max ? `${min} – ${max}` : min ? `≥ ${min}` : `≤ ${max!}`;
      result.push({
        key: "amount",
        label,
        onRemove: () => removeFilters(["amountMin", "amountMax"]),
      });
    }

    return result;
  }, [filter, category, member, removeFilters]);

  return { chips, category, member, seedCategory };
}
