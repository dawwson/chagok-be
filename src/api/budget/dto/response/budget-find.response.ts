import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance, Transform, Type } from 'class-transformer';

import { Budget } from '@src/entity/budget.entity';
import { Category } from '@src/entity/category.entity';
import {
  ApiBudgetCategoryAmount,
  ApiBudgetMonth,
  ApiBudgets,
  ApiBudgetYear,
  ApiCategoryId,
  ApiCategoryName,
} from '@src/shared/decorator/api-custom-property.decorator';

@Exclude()
class BudgetByCategoryWithName {
  @ApiCategoryId()
  @Expose()
  categoryId: number;

  @ApiCategoryName()
  @Expose({ name: 'category' })
  @Transform(({ value }) => value.name)
  categoryName: string;

  @ApiBudgetCategoryAmount()
  @Expose()
  amount: number;
}

@Exclude()
export class BudgetFindResponse {
  @ApiProperty({
    description: '예산 고유 식별자',
    example: 1,
    oneOf: [{ type: 'number' }, { type: 'null' }],
  })
  @Expose()
  id: number | null;

  @ApiBudgetYear({ description: '예산 연도 (YYYY)' })
  @Expose()
  year: number;

  @ApiBudgetMonth({ description: '예산 월 (M~MM)' })
  @Expose()
  month: number;

  @ApiBudgets({ description: '카테고리별 예산', type: BudgetByCategoryWithName })
  @Expose({ name: 'budgetCategories' })
  @Type(() => BudgetByCategoryWithName)
  budgets: BudgetByCategoryWithName[];

  static from(budget: Budget) {
    return plainToInstance(BudgetFindResponse, budget);
  }

  static emptyBudgetFrom(year: number, month: number, categories: Category[]) {
    const res = new BudgetFindResponse();
    res.id = null;
    res.year = year;
    res.month = month;
    res.budgets = categories.map((c) => {
      return {
        categoryId: c.id,
        categoryName: c.name,
        amount: 0,
      };
    });

    return res;
  }
}
