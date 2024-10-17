export interface BudgetCreateInput {
  userId: string;
  year: number;
  month: number;
  budgets: BudgetByCategory[];
}

interface BudgetByCategory {
  categoryId: number;
  amount: number;
}
