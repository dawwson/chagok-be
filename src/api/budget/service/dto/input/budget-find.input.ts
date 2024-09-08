import { BudgetMonth } from '@src/shared/enum/budget-month.enum';

export interface FindBudgetInput {
  userId: string;
  year: string;
  month: BudgetMonth;
}
