import { IsDefined, IsIn, IsNumberString, Length } from 'class-validator';
import { BudgetMonth } from '../../../shared/enum/budget-month.enum';
import { ErrorCode } from '../../../shared/enum/error-code.enum';

export class GetMonthlyBudgetRecommendationRequestParam {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumberString({}, { message: ErrorCode.INVALID_YEAR })
  @Length(4, 4, { message: ErrorCode.INVALID_YEAR })
  year: string;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsIn([...Object.values(BudgetMonth)], { message: ErrorCode.INVALID_MONTH })
  month: BudgetMonth;
}
