import { IsIn, IsNumberString, Length } from 'class-validator';
import { BudgetMonth } from '../../../shared/enum/budget-month.enum';

export class GetMonthlyBudgetRecommendationRequestParam {
  @IsNumberString()
  @Length(4, 4)
  year: string;

  @IsIn([...Object.values(BudgetMonth)])
  month: BudgetMonth;
}
