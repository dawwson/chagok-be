import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { Expense } from '../../../../../entity/expense.entity';

@Exclude()
export class ExpenseShowDetailResponse {
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

  static from(expense: Expense): ExpenseShowDetailResponse {
    return plainToInstance(ExpenseShowDetailResponse, expense);
  }
}
