import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDefined, IsNumber, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import * as dayjs from 'dayjs';

import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { ExpenseCategoryName } from '@src/shared/enum/category-name.enum';
import { BudgetCategory } from '@src/entity/budget-category.entity';
import { ApiBudgetMonth, ApiBudgets, ApiBudgetYear } from '@src/shared/decorator/api-custom-property.decorator';

class BudgetByCategory {
  @ApiProperty({ description: '카테고리 고유 식별자', example: 5 })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.CATEGORY_INVALID_ID })
  categoryId: number;

  @ApiProperty({
    description: '카테고리에 할당할 예산의 금액 (단위: 원)',
    minimum: 0,
    maximum: BudgetCategory.getMaxAmount(),
    example: 100000,
  })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Min(0, { message: ErrorCode.BUDGET_AMOUNT_OUT_OF_RANGE })
  @Max(BudgetCategory.getMaxAmount(), { message: ErrorCode.BUDGET_AMOUNT_OUT_OF_RANGE })
  amount: number;
}

export class BudgetCreateRequest {
  @ApiBudgetYear({ description: '생성할 예산 연도 (YYYY)' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Min(2000, { message: ErrorCode.BUDGET_YEAR_OUT_OF_RANGE })
  @Max(dayjs().year() + 1, { message: ErrorCode.BUDGET_YEAR_OUT_OF_RANGE })
  year: number;

  @ApiBudgetMonth({ description: '생성할 예산 월 (M~MM)' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Min(1, { message: ErrorCode.BUDGET_MONTH_OUT_OF_RANGE })
  @Max(12, { message: ErrorCode.BUDGET_MONTH_OUT_OF_RANGE })
  month: number;

  @ApiBudgets({ description: '생성할 카테고리별 예산', type: BudgetByCategory })
  // 배열인지 검증
  @IsArray({ message: ErrorCode.BUDGET_INVALID_BUDGETS })
  // 배열의 길이 검증
  @ArrayMinSize(Object.keys(ExpenseCategoryName).length, { message: ErrorCode.BUDGET_BUDGETS_OUT_OF_RANGE })
  @ArrayMaxSize(Object.keys(ExpenseCategoryName).length, { message: ErrorCode.BUDGET_BUDGETS_OUT_OF_RANGE })
  // 중첩 객체 또는 배열 검증(each: true -> 배열의 각 요소 모두 검증)
  @ValidateNested({ each: true })
  // 지정한 클래스 타입으로 변환(validation pipe - transform: true 옵션만으로 형변환 안 됨)
  @Type(() => BudgetByCategory)
  budgets: BudgetByCategory[];
}
