/** A root category with rolled-up spend; `children` holds its subcategories. */
export type CategoryBreakdown = {
  categoryId: number;
  parentId: number | null;
  categoryName: string;
  spent: number;
  limit?: number;
  remaining?: number;
  percentUsed?: number;
  overLimit?: boolean;
  children: CategoryBreakdown[];
};

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
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrend: MonthlyTrend[];
  personBreakdown: PersonBreakdown[];
};

export type DashboardFilter = {
  startDate: string;
  endDate: string;
  memberId?: number;
};
