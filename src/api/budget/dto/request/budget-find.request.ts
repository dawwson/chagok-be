import { IsDefined, Max, Min } from 'class-validator';
import * as dayjs from 'dayjs';

import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { Type } from 'class-transformer';

export class BudgetFindRequest {
  @Type(() => Number) // URL에서 문자열로 전달되므로 Number로 형변환
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Min(2000, { message: ErrorCode.BUDGET_YEAR_OUT_OF_RANGE })
  @Max(dayjs().year() + 1, { message: ErrorCode.BUDGET_YEAR_OUT_OF_RANGE })
  year: number;

  @Type(() => Number) // URL에서 문자열로 전달되므로 Number로 형변환
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Min(1, { message: ErrorCode.BUDGET_MONTH_OUT_OF_RANGE })
  @Max(12, { message: ErrorCode.BUDGET_MONTH_OUT_OF_RANGE })
  month: number;
}
