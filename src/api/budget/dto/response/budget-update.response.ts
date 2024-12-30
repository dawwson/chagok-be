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
export class BudgetUpdateResponse {
  @ApiProperty({ description: '수정된 예산 고유 식별자', example: 1 })
  @Expose()
  id: number;

  @ApiBudgetYear({ description: '수정된 예산 연도 (YYYY)' })
  @Expose()
  year: number;

  @ApiBudgetMonth({ description: '수정된 예산 월 (M~MM)' })
  @Expose()
  month: number;

  @ApiBudgetTotalAmount({ description: '수정된 예산 총 금액 (단위 : 원)' })
  @Expose()
  totalAmount: number;

  @ApiBudgets({ description: '수정된 카테고리별 예산', type: BudgetByCategory })
  @Expose({ name: 'budgetCategories' })
  @Type(() => BudgetByCategory)
  budgets: BudgetByCategory[];

  @ApiProperty({
    description: '예산 수정 날짜 (ISO String)',
    example: '2024-10-18T07:14:08.521Z',
  })
  @Expose()
  updatedAt: Date;

  static from(budget: Budget) {
    return plainToInstance(BudgetUpdateResponse, budget);
  }
}
