import { IsDate, IsDefined, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

import { Expense } from 'src/entity/expense.entity';
import { ErrorCode } from '../../../../../shared/enum/error-code.enum';

export class ExpenseRegisterRequest {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.INVALID_CATEGORY_ID })
  readonly categoryId: number;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsString({ message: ErrorCode.INVALID_CONTENT })
  @MaxLength(100, { message: ErrorCode.OUT_OF_RANGE })
  readonly content: string;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.INVALID_AMOUNT })
  @Min(10, { message: ErrorCode.OUT_OF_RANGE }) // 10원 이상
  @Max(2000000000, { message: ErrorCode.OUT_OF_RANGE }) // 20억 이하
  readonly amount: number;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Type(() => Date)
  @IsDate({ message: ErrorCode.INVALID_DATE }) // YYYY-MM-DD
  readonly expenseDate: Date;

  toEntity(userId: string) {
    return Expense.builder()
      .userId(userId)
      .categoryId(this.categoryId)
      .content(this.content)
      .amount(this.amount)
      .isExcluded(false)
      .expenseDate(this.expenseDate)
      .build();
  }
}
