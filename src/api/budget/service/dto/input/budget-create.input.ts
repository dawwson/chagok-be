import { BudgetMonth } from '@src/shared/enum/budget-month.enum';

export class CreateBudgetInput {
  userId: string;
  year: string;
  month: BudgetMonth;
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
