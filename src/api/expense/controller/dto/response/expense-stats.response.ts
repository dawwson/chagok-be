import { CategoryName } from '@src/shared/enum/category-name.enum';

export class ExpenseStatsResponse {
  private constructor(
    private monthlyExpenseByCategory: MonthlyExpenseByCategory[],
    private weeklyExpenseByCategory: WeeklyExpenseByCategory[],
  ) {}

  static from(
    monthlyExpenseByCategory: MonthlyExpenseByCategory[],
    weeklyExpenseByCategory: WeeklyExpenseByCategory[],
  ) {
    return new ExpenseStatsResponse(monthlyExpenseByCategory, weeklyExpenseByCategory);
  }
}

interface MonthlyExpenseByCategory {
  categoryId: number;
  categoryName: CategoryName;
  lastMonthExpense: number;
  thisMonthExpense: number;
}

interface WeeklyExpenseByCategory {
  categoryId: number;
  categoryName: CategoryName;
  lastWeekExpense: number;
  thisWeekExpense: number;
}
