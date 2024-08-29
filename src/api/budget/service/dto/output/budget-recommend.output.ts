export interface RecommendBudgetOutput {
  budgetsByCategory: BudgetByCategory[];
}

export interface BudgetByCategory {
  categoryId: number;
  amount: number;
}
