import { Expose } from 'class-transformer';
import { BudgetMonth } from 'src/shared/enum/budget-month.enum';

export class BudgetRecommendInput {
  userId: string;
  year: string;
  month: BudgetMonth;
  totalAmount: number;
}
