import { BudgetMonth } from '../../../shared/enum/budget-month.enum';

export class GetBudgetRecommendationDto {
  userId: string;
  year: string;
  month: BudgetMonth;
  totalAmount: number;
}
