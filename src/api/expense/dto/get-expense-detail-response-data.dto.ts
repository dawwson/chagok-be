import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { Expense } from '../../../entity/expense.entity';

@Exclude()
export class GetExpenseDetailResponseData {
  @Expose()
  id: number;

  @Expose()
  categoryId: number;

  @Expose()
  content: string;

  @Expose()
  amount: number;

  @Expose()
  expenseDate: Date;

  @Expose()
  isExcluded: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  static of(expense: Expense): GetExpenseDetailResponseData {
    return plainToInstance(GetExpenseDetailResponseData, expense);
  }
}
