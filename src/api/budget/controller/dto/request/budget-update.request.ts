import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsIn,
  IsNumber,
  IsNumberString,
  IsPositive,
  Length,
  ValidateNested,
} from 'class-validator';

import { BudgetMonth } from '@src/shared/enum/budget-month.enum';
import { ErrorCode } from '@src/shared/enum/error-code.enum';

export class BudgetUpdateRequestBody {
  // 배열인지 검증
  @IsArray({ message: ErrorCode.INVALID_BUDGET_BY_CATEGORY })
  // 중첩 객체 또는 배열 검증(each: true -> 배열의 각 요소 모두 검증)
  @ValidateNested({ each: true })
  // 지정한 클래스 타입으로 변환(validation pipe - transform: true 옵션만으로 형변환 안 됨)
  @Type(() => BudgetByCategory)
  budgetsByCategory: BudgetByCategory[];
}

class BudgetByCategory {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.INVALID_CATEGORY_ID })
  categoryId: number;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.INVALID_AMOUNT })
  @IsPositive({ message: ErrorCode.INVALID_AMOUNT })
  amount: number;
}

export class BudgetUpdateRequestParam {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumberString({}, { message: ErrorCode.INVALID_YEAR })
  @Length(4, 4, { message: ErrorCode.INVALID_YEAR })
  @IsNumberString()
  @Length(4, 4)
  year: string;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsIn([...Object.values(BudgetMonth)], { message: ErrorCode.INVALID_MONTH })
  month: BudgetMonth;
}
