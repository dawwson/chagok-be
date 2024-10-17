export class UpdateBudgetInput {
  budgetId: number;
  budgetsByCategory: BudgetByCategory[];

  calculateTotalAmount() {
    return this.budgetsByCategory.reduce((totalAmount, { amount }) => {
      return (totalAmount += amount);
    }, 0);
  }
}

interface BudgetByCategory {
  categoryId: number;
  amount: number;
}
