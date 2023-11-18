import {
  IsDate,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  Validate,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GetExpensesCondition } from './get-expenses-condition.dto';
import { BadRequestException } from '@nestjs/common';
import { GetCategoriesWithTotalAmountCondition } from './get-categories-with-total-amount-condition.dto';

export class GetExpensesListRequestQuery {
  @Type(() => Date)
  @IsDate()
  startDate: number;

  @Type(() => Date)
  @IsDate()
  endDate: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @ValidateIf((o) => o.maxAmount !== undefined)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1000)
  minAmount?: number;

  @ValidateIf((o) => o.minAmount !== undefined)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxAmount?: number;

  toGetExpensesCondition(userId: string): GetExpensesCondition {
    const getExpensesCondition = new GetExpensesCondition();
    getExpensesCondition.userId = userId;
    getExpensesCondition.startDate = this.startDate;
    getExpensesCondition.endDate = this.endDate;
    getExpensesCondition.categoryId = this.categoryId;

    if (
      (!this.minAmount && this.maxAmount) ||
      (this.minAmount && !this.maxAmount)
    ) {
      throw new BadRequestException(
        'minAmount와 maxAmount는 함께 포함되어야 합니다.',
      );
    }

    if (this.minAmount > this.maxAmount) {
      throw new BadRequestException('minAmount는 maxAmount보다 작아야 합니다.');
    }

    if (this.minAmount && this.maxAmount) {
      getExpensesCondition.maxAmount = this.maxAmount;
      getExpensesCondition.minAmount = this.minAmount;
    }

    return getExpensesCondition;
  }

  toGetCategoriesWithTotalAmountCondition(
    userId: string,
  ): GetCategoriesWithTotalAmountCondition {
    const getCategoriesWithTotalAmountCondition =
      new GetCategoriesWithTotalAmountCondition();
    getCategoriesWithTotalAmountCondition.userId = userId;
    getCategoriesWithTotalAmountCondition.startDate = this.startDate;
    getCategoriesWithTotalAmountCondition.endDate = this.endDate;

    if (this.minAmount && this.maxAmount) {
      getCategoriesWithTotalAmountCondition.maxAmount = this.maxAmount;
      getCategoriesWithTotalAmountCondition.minAmount = this.minAmount;
    }
    return getCategoriesWithTotalAmountCondition;
  }
}
