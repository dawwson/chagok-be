import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';

import { Budget } from '../../../entity/budget.entity';
import { BudgetMonth } from '../../../shared/enum/budget-month.enum';

@Exclude()
class BudgetByCategory {
  @Expose({ name: 'categoryId' })
  categoryId: number;

  @Expose({ name: 'amount' })
  amount: number;
}

@Exclude()
export class SetMonthlyBudgetResponseData {
  @Expose()
  id: number;

  @Expose()
  year: string;

  @Expose()
  month: BudgetMonth;

  @Expose({ name: 'budgetCategories' })
  @Type(() => BudgetByCategory)
  budgetsByCategory: BudgetByCategory;

  static of(budget: Budget) {
    return plainToInstance(SetMonthlyBudgetResponseData, budget);
  }
}
