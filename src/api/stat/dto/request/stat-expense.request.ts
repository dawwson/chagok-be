import { Transform } from 'class-transformer';
import { IsDefined, IsIn, Max, Min } from 'class-validator';
import * as dayjs from 'dayjs';

import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { ApiBudgetMonth, ApiBudgetYear } from '@src/shared/decorator/api-custom-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class StatExpenseRequestParam {
  @ApiBudgetYear({ description: '조회할 지출 통계 연도 (YYYY)' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Transform(({ value }) => parseInt(value)) // URL에서 문자열로 전달되므로 Number로 형변환
  @Min(dayjs().year(), { message: ErrorCode.BUDGET_YEAR_OUT_OF_RANGE })
  @Max(dayjs().year() + 1, { message: ErrorCode.BUDGET_YEAR_OUT_OF_RANGE })
  year: number;

  @ApiBudgetMonth({ description: '조회할 지출 통계 월 (M~MM)' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Transform(({ value }) => parseInt(value)) // URL에서 문자열로 전달되므로 Number로 형변환
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Min(1, { message: ErrorCode.BUDGET_MONTH_OUT_OF_RANGE })
  @Max(12, { message: ErrorCode.BUDGET_MONTH_OUT_OF_RANGE })
  month: number;
}

export class StatExpenseRequestQuery {
  @ApiProperty({
    description: '조회할 지출 통계의 유형',
    enum: ['monthly', 'yearly'],
    example: 'monthly',
  })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsIn(['monthly', 'yearly'], { message: ErrorCode.STAT_INVALID_VIEW })
  view: 'monthly' | 'yearly';
}
