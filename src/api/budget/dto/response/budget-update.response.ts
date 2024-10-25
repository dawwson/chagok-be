import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { Budget } from '@src/entity/budget.entity';

@Exclude()
export class BudgetUpdateResponse {
  @Expose()
  id: number;

  @Expose()
  year: number;

  @Expose()
  month: number;

  @Expose()
  totalAmount: number;

  @Expose({ name: 'budgetCategories' })
  @Type(() => BudgetByCategory)
  budgets: BudgetByCategory[];

  @Expose()
  updatedAt: Date;

  static from(budget: Budget) {
    return plainToInstance(BudgetUpdateResponse, budget);
  }
}

@Exclude()
class BudgetByCategory {
  @Expose()
  categoryId: number;

  @Expose()
  amount: number;
}
