import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { CategoryName } from 'src/shared/enum/category-name.enum';

@Exclude()
export class ExpenseFindMonthlyOutput {
  @Expose({ name: 'category_id' })
  categoryId: number;

  @Expose({ name: 'category_name' })
  categoryName: CategoryName;

  @Expose({ name: 'last_month_expense' })
  @Type(() => Number)
  lastMonthExpense: number;

  @Expose({ name: 'this_month_expense' })
  @Type(() => Number)
  thisMonthExpense: number;

  static from(rawResults: ExpenseFindMonthlyRawResult[]) {
    return plainToInstance(ExpenseFindMonthlyOutput, rawResults);
  }
}

export interface ExpenseFindMonthlyRawResult {
  category_id: number;
  category_name: CategoryName;
  last_month_expense: string;
  this_month_expense: string;
}
