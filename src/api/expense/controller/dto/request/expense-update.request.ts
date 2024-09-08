import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { Expense } from '@src/entity/expense.entity';

export class ExpenseUpdateRequest {
  @IsNumber({}, { message: ErrorCode.INVALID_CATEGORY_ID })
  @IsOptional()
  readonly categoryId?: number;

  @IsString({ message: ErrorCode.INVALID_CONTENT })
  @MaxLength(100, { message: ErrorCode.OUT_OF_RANGE })
  @IsNotEmpty({ message: ErrorCode.EMPTY_CONTENT })
  @IsOptional()
  readonly content?: string;

  @IsNumber({}, { message: ErrorCode.INVALID_AMOUNT })
  @Min(10, { message: ErrorCode.OUT_OF_RANGE }) // 10원 이상
  @Max(2000000000, { message: ErrorCode.OUT_OF_RANGE }) // 20억 이하
  @IsOptional()
  readonly amount?: number;

  @Type(() => Date)
  @IsDate({ message: ErrorCode.INVALID_DATE }) // YYYY-MM-DD
  @IsOptional()
  readonly expenseDate?: Date;

  @IsBoolean({ message: ErrorCode.INVALID_IS_EXCLUDED })
  @IsOptional()
  readonly isExcluded?: boolean;

  toEntity(expenseId: number) {
    return Expense.builder()
      .id(expenseId)
      .categoryId(this.categoryId)
      .content(this.content)
      .amount(this.amount)
      .expenseDate(this.expenseDate)
      .isExcluded(this.isExcluded)
      .build();
  }
}
