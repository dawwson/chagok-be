import { IsDefined, IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';
import { ErrorCode } from '../../../shared/enum/error-code.enum';

export class GetMonthlyBudgetRecommendationRequestQuery {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: ErrorCode.INVALID_TOTAL_AMOUNT })
  @IsPositive({ message: ErrorCode.INVALID_TOTAL_AMOUNT })
  totalAmount: number;
}
