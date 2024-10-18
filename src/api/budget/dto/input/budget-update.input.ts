export interface BudgetUpdateInput {
  budgets: Array<{
    categoryId: number;
    amount: number;
  }>;
}
