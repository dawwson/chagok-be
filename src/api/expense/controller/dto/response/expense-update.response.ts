import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { Expense } from 'src/entity/expense.entity';

@Exclude()
export class ExpenseUpdateResponse {
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

  static from(expense: Expense): ExpenseUpdateResponse {
    return plainToInstance(ExpenseUpdateResponse, expense);
  }
}
