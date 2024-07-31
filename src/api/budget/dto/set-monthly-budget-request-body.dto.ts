import {
  IsArray,
  IsDefined,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ErrorCode } from '../../../shared/enum/error-code.enum';

export class BudgetByCategory {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.INVALID_CATEGORY_ID })
  categoryId: number;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.INVALID_AMOUNT })
  @IsPositive({ message: ErrorCode.INVALID_AMOUNT })
  amount: number;
}

export class SetMonthlyBudgetRequestBody {
  // 배열인지 검증
  @IsArray({ message: ErrorCode.INVALID_BUDGET_BY_CATEGORY })
  // 중첩 객체 또는 배열 검증(each: true -> 배열의 각 요소 모두 검증)
  @ValidateNested({ each: true })
  // 지정한 클래스 타입으로 변환(validation pipe - transform: true 옵션만으로 형변환 안 됨)
  @Type(() => BudgetByCategory)
  budgetsByCategory: BudgetByCategory[];
}
