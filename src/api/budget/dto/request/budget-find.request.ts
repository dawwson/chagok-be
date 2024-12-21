import { IsDefined, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import * as dayjs from 'dayjs';

import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { ApiBudgetMonth, ApiBudgetYear } from '@src/shared/decorator/api-custom-property.decorator';

export class BudgetFindRequest {
  @ApiBudgetYear({ description: '예산 연도 (YYYY)' })
  @Type(() => Number) // URL에서 문자열로 전달되므로 Number로 형변환
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Min(2000, { message: ErrorCode.BUDGET_YEAR_OUT_OF_RANGE })
  @Max(dayjs().year() + 1, { message: ErrorCode.BUDGET_YEAR_OUT_OF_RANGE })
  year: number;

  @ApiBudgetMonth({ description: '예산 월 (M~MM)' })
  @Type(() => Number) // URL에서 문자열로 전달되므로 Number로 형변환
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Min(1, { message: ErrorCode.BUDGET_MONTH_OUT_OF_RANGE })
  @Max(12, { message: ErrorCode.BUDGET_MONTH_OUT_OF_RANGE })
  month: number;
}
