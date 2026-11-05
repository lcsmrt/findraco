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
};

export type DashboardSummaryResponse = {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  /** The same figures counting only actual transactions; the three above are the forecast. */
  actualIncome: number;
  actualExpenses: number;
  actualBalance: number;
  personBreakdown: PersonBreakdown[];
};

export type DashboardFilter = {
  startDate: string;
  endDate: string;
  memberId?: number;
};
