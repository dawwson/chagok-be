import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { Expense } from '@src/entity/expense.entity';

@Exclude()
export class ExpenseRegisterResponse {
  @Expose()
  id: number;

  @Expose()
  categoryId: number;

  @Expose()
  content: string;

  @Expose()
  amount: number;

  @Expose()
  isExcluded: boolean;

  @Expose()
  expenseDate: Date;

  @Expose()
  createdAt: Date;

  static from(expense: Expense) {
    return plainToInstance(ExpenseRegisterResponse, expense);
  }
}
