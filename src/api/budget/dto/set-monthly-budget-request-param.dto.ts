import { IsIn, IsNumberString, IsString, Length, Min } from 'class-validator';
import { BudgetMonth } from '../../../shared/enum/budget-month.enum';

export class SetMonthlyBudgetRequestParam {
  @IsNumberString()
  @Length(4, 4)
  year: string;

  @IsIn([...Object.values(BudgetMonth)])
  month: string;
}
