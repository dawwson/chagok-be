export class BudgetRecommendResponse {
  year: number;
  month: number;
  budgets: BudgetByCategory[];

  static from(year: number, month, budgets: BudgetByCategory[]) {
    const budgetRecommendResponse = new BudgetRecommendResponse();
    budgetRecommendResponse.year = year;
    budgetRecommendResponse.month = month;
    budgetRecommendResponse.budgets = budgets;

    return budgetRecommendResponse;
  }
}

interface BudgetByCategory {
  categoryId: number;
  categoryName: string;
  amount: number;
}
