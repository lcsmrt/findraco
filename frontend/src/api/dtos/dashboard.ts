export type MonthlyTrend = {
  year: number;
  month: number;
  income: number;
  expenses: number;
};

export type PersonBreakdown = {
  userId: number;
  name: string;
  income: number;
  expense: number;
  net: number;
  /** The same figures counting only actual transactions; the three above count the forecast too. */
  actualIncome: number;
  actualExpense: number;
  actualNet: number;
};

export type DashboardSummaryResponse = {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  /** The same figures counting only actual transactions; the three above are the forecast. */
  actualIncome: number;
  actualExpenses: number;
  actualBalance: number;
  /** Money out of the plan in neutral movements (transfers, card bills, savings); in no total above. */
  neutralOut: number;
  /** Money in through neutral movements; in no total above. */
  neutralIn: number;
  personBreakdown: PersonBreakdown[];
};

export type DashboardFilter = {
  startDate: string;
  endDate: string;
  memberId?: number;
};
