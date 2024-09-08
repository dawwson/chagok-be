import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { Budget } from '@src/entity/budget.entity';
import { BudgetMonth } from '@src/shared/enum/budget-month.enum';

@Exclude()
class BudgetByCategory {
  @Expose({ name: 'categoryId' })
  categoryId: number;

  @Expose({ name: 'amount' })
  amount: number;
}

@Exclude()
export class BudgetUpdateResponse {
  @Expose()
  id: number;

  @Expose()
  year: string;

  @Expose()
  month: BudgetMonth;

  @Expose({ name: 'budgetCategories' })
  @Type(() => BudgetByCategory)
  budgetsByCategory: BudgetByCategory;

  static from(budget: Budget) {
    return plainToInstance(BudgetUpdateResponse, budget);
  }
}
