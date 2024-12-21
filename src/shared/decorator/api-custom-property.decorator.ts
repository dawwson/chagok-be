import { applyDecorators, Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs';

import { Budget } from '@src/entity/budget.entity';
import { BudgetCategory } from '@src/entity/budget-category.entity';
import { Category } from '@src/entity/category.entity';

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

export const ApiCategoryId = () => {
  return applyDecorators(ApiProperty({ description: '카테고리 고유 식별자', example: 5 }));
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
