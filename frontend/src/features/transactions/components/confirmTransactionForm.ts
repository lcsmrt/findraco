import type { ConfirmTransactionRequest, Transaction } from "@/api/dtos/transaction";
import { toLocalDate, toIsoDate } from "@/utils/dates";
import { z } from "zod";

export const confirmTransactionSchema = z.object({
  amount: z
    .number()
    .nullable()
    .refine(
      (value): value is number => value !== null && value > 0,
      "transactions.form.amountMustBePositive",
    ),
  date: z.date({ required_error: "transactions.form.dateIsRequired" }),
});

export type ConfirmTransactionFormValues = z.input<typeof confirmTransactionSchema>;
export type ConfirmTransactionFormOutput = z.output<typeof confirmTransactionSchema>;

/** The occurrence's own amount and date: a confirm usually fixes the amount and keeps the day. */
export function toConfirmFormValues(transaction: Transaction): ConfirmTransactionFormValues {
  return { amount: transaction.amount, date: toLocalDate(transaction.startDate) };
}

export function toConfirmPayload(
  transaction: Transaction,
  values: ConfirmTransactionFormOutput,
): ConfirmTransactionRequest {
  return {
    params: { id: transaction.id },
    body: {
      amount: values.amount,
      startDate: toIsoDate(values.date),
      version: transaction.version,
    },
  };
}
