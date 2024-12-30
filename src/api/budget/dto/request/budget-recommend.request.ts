import { Transform } from 'class-transformer';
import { IsDefined, Max, Min } from 'class-validator';
import * as dayjs from 'dayjs';

import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { Budget } from '@src/entity/budget.entity';
import {
  ApiBudgetMonth,
  ApiBudgetTotalAmount,
  ApiBudgetYear,
} from '@src/shared/decorator/api-custom-property.decorator';

export class BudgetRecommendRequestParam {
  @ApiBudgetYear({ description: '추천받을 예산 연도 (YYYY)' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Transform(({ value }) => parseInt(value)) // URL에서 문자열로 전달되므로 Number로 형변환
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Min(dayjs().year(), { message: ErrorCode.BUDGET_YEAR_OUT_OF_RANGE })
  @Max(dayjs().year() + 1, { message: ErrorCode.BUDGET_YEAR_OUT_OF_RANGE })
  year: number;

  @ApiBudgetMonth({ description: '추천받을 예산 월 (M~MM)' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Transform(({ value }) => parseInt(value)) // URL에서 문자열로 전달되므로 Number로 형변환
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Min(1, { message: ErrorCode.BUDGET_MONTH_OUT_OF_RANGE })
  @Max(12, { message: ErrorCode.BUDGET_MONTH_OUT_OF_RANGE })
  month: number;
}

export class BudgetRecommendRequestQuery {
  @ApiBudgetTotalAmount({ description: '총 예산 금액 (단위 : 원)' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Transform(({ value }) => parseInt(value)) // URL에서 문자열로 전달되므로 Number로 형변환
  @Min(1, { message: ErrorCode.BUDGET_TOTAL_AMOUNT_OUT_OF_RANGE })
  @Max(Budget.getMaxTotalAmount(), { message: ErrorCode.BUDGET_TOTAL_AMOUNT_OUT_OF_RANGE })
  totalAmount: number;
}
