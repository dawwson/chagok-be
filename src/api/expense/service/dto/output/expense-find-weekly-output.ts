import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { CategoryName } from '@src/shared/enum/category-name.enum';

@Exclude()
export class ExpenseFindWeeklyOutput {
  @Expose({ name: 'category_id' })
  categoryId: number;

  @Expose({ name: 'category_name' })
  categoryName: CategoryName;

  @Expose({ name: 'last_week_expense' })
  @Type(() => Number)
  lastWeekExpense: number;

  @Expose({ name: 'this_week_expense' })
  @Type(() => Number)
  thisWeekExpense: number;

  static from(rawResults: ExpenseFindWeeklyRawResult[]) {
    return plainToInstance(ExpenseFindWeeklyOutput, rawResults);
  }
}

export interface ExpenseFindWeeklyRawResult {
  category_id: number;
  category_name: CategoryName;
  last_month_expense: string;
  this_month_expense: string;
}
