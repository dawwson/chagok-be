import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDefined, IsNumber, Max, Min, ValidateNested } from 'class-validator';

import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { BudgetCategory } from '@src/entity/budget-category.entity';
import { Category } from '@src/entity/category.entity';
import {
  ApiBudgetCategoryAmount,
  ApiBudgets,
  ApiCategoryId,
} from '@src/shared/decorator/api-custom-property.decorator';

class BudgetByCategory {
  @ApiCategoryId({ description: '카테고리 고유 식별자' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.CATEGORY_INVALID_ID })
  categoryId: number;

  @ApiBudgetCategoryAmount()
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Min(0, { message: ErrorCode.BUDGET_AMOUNT_OUT_OF_RANGE })
  @Max(BudgetCategory.getMaxAmount(), { message: ErrorCode.BUDGET_AMOUNT_OUT_OF_RANGE })
  amount: number;
}

export class BudgetUpdateRequest {
  @ApiBudgets({ description: '수정할 카테고리별 예산', type: BudgetByCategory })
  // 배열인지 검증
  @IsArray({ message: ErrorCode.BUDGET_INVALID_BUDGETS })
  // 배열의 길이 검증
  @ArrayMinSize(Category.getExpenseCategoryCount(), { message: ErrorCode.BUDGET_BUDGETS_OUT_OF_RANGE })
  @ArrayMaxSize(Category.getExpenseCategoryCount(), { message: ErrorCode.BUDGET_BUDGETS_OUT_OF_RANGE })
  // 중첩 객체 또는 배열 검증(each: true -> 배열의 각 요소 모두 검증)
  @ValidateNested({ each: true })
  // 지정한 클래스 타입으로 변환(validation pipe - transform: true 옵션만으로 형변환 안 됨)
  @Type(() => BudgetByCategory)
  budgets: BudgetByCategory[];
}
