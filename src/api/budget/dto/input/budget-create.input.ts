export interface BudgetCreateInput {
  userId: string;
  year: number;
  month: number;
  budgets: Array<{
    categoryId: number;
    amount: number;
  }>;
}
