import {
  Exclude,
  Expose,
  plainToInstance,
  Transform,
  Type,
} from 'class-transformer';
import { Expense } from '../../../entity/expense.entity';
import { Category } from '../../../entity/category.entity';

@Exclude()
export class GetExpensesListResponseData {
  @Expose()
  totalAmount: number;

  @Expose()
  totalAmountsByCategory: CategoryWithTotalAmount[];

  @Expose()
  expenses: PartialExpense[];

  static of(expenses: Expense[], categories: Category[]) {
    const getExpensesListResponseData = new GetExpensesListResponseData();
    getExpensesListResponseData.totalAmount = expenses.reduce(
      (acc, expense) => (acc += expense.amount),
      0,
    );
    getExpensesListResponseData.totalAmountsByCategory = plainToInstance(
      CategoryWithTotalAmount,
      categories,
    );
    getExpensesListResponseData.expenses = plainToInstance(
      PartialExpense,
      expenses,
    );
    return getExpensesListResponseData;
  }
}

class CategoryWithTotalAmount {
  @Expose({ name: 'id' })
  categoryId: number;

  @Expose()
  name: string;

  @Type(() => Number)
  @Expose()
  totalAmount: number;
}

@Exclude()
class PartialExpense {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  amount: string;

  @Expose()
  expenseDate: string;

  @Expose({ name: 'category' })
  @Transform(({ value }) => value.name) // 카테고리 이름만 추출
  categoryName: string;
}
