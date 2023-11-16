import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { Expense } from '../../../entity/expense.entity';

@Exclude()
export class CreateExpenseResponseData {
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

  static of(expense: Expense): CreateExpenseResponseData {
    return plainToInstance(CreateExpenseResponseData, expense);
  }
}
