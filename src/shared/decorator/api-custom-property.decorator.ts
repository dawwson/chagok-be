import { applyDecorators, Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import * as dayjs from 'dayjs';

import { Budget } from '@src/entity/budget.entity';
import { BudgetCategory } from '@src/entity/budget-category.entity';
import { Category } from '@src/entity/category.entity';
import { TxType } from '@src/shared/enum/tx-type.enum';
import { TxMethod } from '../enum/tx-method.enum';

export const ApiBudgetYear = (options: { description: string }) => {
  const { description } = options;

  return applyDecorators(
    ApiProperty({
      description,
      minimum: 2000,
      maximum: dayjs().year() + 1,
      example: 2024,
    }),
  );
};

export const ApiBudgetMonth = (options: { description: string }) => {
  const { description } = options;

  return applyDecorators(
    ApiProperty({
      description,
      minimum: 1,
      maximum: 12,
      example: 10,
    }),
  );
};

export const ApiBudgets = (options: { description: string; type: Type<any> }) => {
  const { description, type } = options;

  return applyDecorators(
    ApiProperty({
      description,
      type: () => [type],
      minItems: Category.getExpenseCategoryCount(),
      maxItems: Category.getExpenseCategoryCount(),
    }),
  );
};

export const ApiBudgetTotalAmount = (options: { description: string }) => {
  const { description } = options;

  return applyDecorators(
    ApiProperty({
      description,
      minimum: 0,
      maximum: Budget.getMaxTotalAmount(),
      example: 1000000,
    }),
  );
};

export const ApiCategoryId = (options: { description: string }) => {
  const { description } = options;
  return applyDecorators(ApiProperty({ description, example: 5 }));
};

export const ApiCategoryName = () => {
  return applyDecorators(ApiProperty({ description: '카테고리 이름', example: 'food' }));
};

export const ApiBudgetCategoryAmount = () => {
  return applyDecorators(
    ApiProperty({
      description: '카테고리에 할당된 예산 금액 (단위: 원)',
      minimum: 0,
      maximum: BudgetCategory.getMaxAmount(),
      example: 100000,
    }),
  );
};

export const ApiTxType = (options: { description: string }) => {
  const { description } = options;

  return applyDecorators(
    ApiProperty({
      description,
      enum: TxType,
      example: TxType.EXPENSE,
    }),
  );
};

export const ApiTxMethod = (options: { description: string }) => {
  const { description } = options;

  return applyDecorators(
    ApiProperty({
      description,
      enum: TxMethod,
      example: TxMethod.CREDIT_CARD,
    }),
  );
};

export const ApiTxAmount = (options: { description: string }) => {
  const { description } = options;

  return applyDecorators(
    ApiProperty({
      description,
      minimum: 1,
      maximum: BudgetCategory.getMaxAmount(),
      example: 6800,
    }),
  );
};

export const ApiISOString = (options: { description: string }) => {
  const { description } = options;

  return applyDecorators(
    ApiProperty({
      description,
      example: '2024-10-18T07:14:08.521Z',
    }),
  );
};

export const ApiTxDescription = (options: { description: string; required: boolean }) => {
  const { description, required } = options;

  return applyDecorators(
    ApiProperty({
      description,
      maxLength: 100,
      example: 'coffee ☕️',
      required,
    }),
  );
};

export const ApiTxIsExcluded = (options: { description: string }) => {
  const { description } = options;

  return applyDecorators(
    ApiProperty({
      description,
      example: false,
    }),
  );
};
