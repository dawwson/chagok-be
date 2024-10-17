import { Budget } from '@src/entity/budget.entity';
import { Category } from '@src/entity/category.entity';
import { Exclude, Expose, plainToInstance, Transform, Type } from 'class-transformer';

@Exclude()
export class BudgetFindResponse {
  @Expose()
  id: number | null;

  @Expose()
  year: number;

  @Expose()
  month: number;

  @Expose({ name: 'budgetCategories' })
  @Type(() => BudgetByCategory)
  budgets: BudgetByCategory[];

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

@Exclude()
class BudgetByCategory {
  @Expose()
  categoryId: number;

  @Expose({ name: 'category' })
  @Transform(({ value }) => value.name)
  categoryName: string;

  @Expose()
  amount: number;
}
