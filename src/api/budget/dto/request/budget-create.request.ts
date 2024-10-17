import { ArrayMaxSize, ArrayMinSize, IsArray, IsDefined, IsNumber, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import * as dayjs from 'dayjs';

import { Budget } from '@src/entity/budget.entity';
import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { ExpenseCategoryName } from '@src/shared/enum/category-name.enum';

export class BudgetCreateRequest {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Min(2000, { message: ErrorCode.BUDGET_YEAR_OUT_OF_RANGE })
  @Max(dayjs().year() + 1, { message: ErrorCode.BUDGET_YEAR_OUT_OF_RANGE })
  year: number;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Min(1, { message: ErrorCode.BUDGET_MONTH_OUT_OF_RANGE })
  @Max(12, { message: ErrorCode.BUDGET_MONTH_OUT_OF_RANGE })
  month: number;

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

class BudgetByCategory {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.CATEGORY_INVALID_ID })
  categoryId: number;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Min(0, { message: ErrorCode.BUDGET_AMOUNT_OUT_OF_RANGE })
  @Max(Budget.maxTotalAmount(), { message: ErrorCode.BUDGET_AMOUNT_OUT_OF_RANGE })
  amount: number;
}
