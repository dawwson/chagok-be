import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { Expense } from '../../../entity/expense.entity';

@Exclude()
export class CreateExpenseResponseData {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  static of(expense: Expense): CreateExpenseResponseData {
    return plainToInstance(CreateExpenseResponseData, expense);
  }
}
