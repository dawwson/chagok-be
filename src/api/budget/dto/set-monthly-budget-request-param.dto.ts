import { IsDefined, IsIn, IsNumberString, Length } from 'class-validator';
import { BudgetMonth } from '../../../shared/enum/budget-month.enum';
import { ErrorCode } from 'src/shared/enum/error-code.enum';

export class SetMonthlyBudgetRequestParam {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumberString({}, { message: ErrorCode.INVALID_YEAR })
  @Length(4, 4, { message: ErrorCode.INVALID_YEAR })
  @IsNumberString()
  @Length(4, 4)
  year: string;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsIn([...Object.values(BudgetMonth)], { message: ErrorCode.INVALID_MONTH })
  month: BudgetMonth;
}
