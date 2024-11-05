import { Transform } from 'class-transformer';
import { IsDefined, IsIn, Max, Min } from 'class-validator';
import * as dayjs from 'dayjs';

import { ErrorCode } from '@src/shared/enum/error-code.enum';

export class StatExpenseRequestParam {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Transform(({ value }) => parseInt(value)) // URL에서 문자열로 전달되므로 Number로 형변환
  @Min(dayjs().year(), { message: ErrorCode.BUDGET_YEAR_OUT_OF_RANGE })
  @Max(dayjs().year() + 1, { message: ErrorCode.BUDGET_YEAR_OUT_OF_RANGE })
  year: number;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Transform(({ value }) => parseInt(value)) // URL에서 문자열로 전달되므로 Number로 형변환
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Min(1, { message: ErrorCode.BUDGET_MONTH_OUT_OF_RANGE })
  @Max(12, { message: ErrorCode.BUDGET_MONTH_OUT_OF_RANGE })
  month: number;
}

export class StatExpenseRequestQuery {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsIn(['monthly', 'yearly'], { message: ErrorCode.STAT_INVALID_VIEW })
  view: 'monthly' | 'yearly';
}
