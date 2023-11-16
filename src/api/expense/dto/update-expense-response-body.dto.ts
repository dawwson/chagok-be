import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { Expense } from '../../../entity/expense.entity';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

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
