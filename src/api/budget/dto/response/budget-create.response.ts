import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';

import { Budget } from '@src/entity/budget.entity';
import {
  ApiBudgetCategoryAmount,
  ApiBudgetMonth,
  ApiBudgets,
  ApiBudgetTotalAmount,
  ApiBudgetYear,
  ApiCategoryId,
} from '@src/shared/decorator/api-custom-property.decorator';

@Exclude()
class BudgetByCategory {
  @ApiCategoryId({ description: '카테고리 고유 식별자' })
  @Expose()
  categoryId: number;

  @ApiBudgetCategoryAmount()
  @Expose()
  amount: number;
}

@Exclude()
export class BudgetCreateResponse {
  @ApiProperty({ description: '생성된 예산의 고유 식별자', example: 1 })
  @Expose()
  id: number;

  @ApiBudgetYear({ description: '생성된 예산 연도 (YYYY)' })
  @Expose()
  year: number;

  @ApiBudgetMonth({ description: '생성된 예산 월 (M~MM)' })
  @Expose()
  month: number;

  @ApiBudgetTotalAmount({ description: '생성된 예산 총 금액 (단위 : 원)' })
  @Expose()
  totalAmount: number;

  @ApiBudgets({ description: '생성된 카테고리별 예산', type: BudgetByCategory })
  @Expose({ name: 'budgetCategories' })
  @Type(() => BudgetByCategory)
  budgets: BudgetByCategory[];

  static from(budget: Budget) {
    return plainToInstance(BudgetCreateResponse, budget);
  }
}
