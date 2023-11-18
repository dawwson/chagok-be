import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { Expense } from '../../../entity/expense.entity';
import { Category } from '../../../entity/category.entity';

@Exclude()
export class GetExpensesListResponseData {
  @Expose()
  totalAmount: number;

  @Expose()
  totalAmountByCategory: CategoryWithTotalAmount[];

  @Expose()
  expenses: PartialExpense[];

  static of(expenses: Expense[], Categories: Category[]) {
    const getExpensesListResponseData = new GetExpensesListResponseData();
    getExpensesListResponseData.totalAmount = expenses.reduce(
      (acc, expense) => (acc += expense.amount),
      0,
    );
    getExpensesListResponseData.totalAmountByCategory = plainToInstance(
      CategoryWithTotalAmount,
      Categories,
    );
    getExpensesListResponseData.expenses = plainToInstance(
      PartialExpense,
      expenses,
    );
    return getExpensesListResponseData;
  }
}

class CategoryWithTotalAmount {
  @Expose()
  id: number;

  @Expose()
  name: number;

  @Expose()
  totalAmount: number;
}

@Exclude()
class PartialExpense {
  @Expose()
  id: number;

  @Expose()
  content: number;

  @Expose()
  amount: number;

  @Expose()
  expenseDate: string;

  @Expose({ name: 'category' })
  @Transform(({ value }) => value.name) // 카테고리 이름만 추출
  categoryName: string;
}
