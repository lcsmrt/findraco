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
  personBreakdown: PersonBreakdown[];
};

export type DashboardFilter = {
  startDate: string;
  endDate: string;
  memberId?: number;
};
