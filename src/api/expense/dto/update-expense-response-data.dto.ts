import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { Expense } from '../../../entity/expense.entity';

@Exclude()
export class UpdateExpenseResponseData {
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
  updatedAt: Date;

  static of(expense: Expense): UpdateExpenseResponseData {
    return plainToInstance(UpdateExpenseResponseData, expense);
  }
}
