import { Exclude, Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { ExpenseFindByCategoryOutput } from 'src/api/expense/service/dto/output/expense-find-by-category.output';
import { Expense } from 'src/entity/expense.entity';
import { CategoryName } from 'src/shared/enum/category-name.enum';

@Exclude()
export class ExpenseShowResponse {
  @Expose()
  totalAmount: number;

  @Expose()
  expensesByCategory: ExpenseByCategory[];

  @Expose()
  expenses: PartialExpense[];

  static from(expenses: Expense[], expensesByCategory: ExpenseFindByCategoryOutput[]) {
    const expenseShowResponse = new ExpenseShowResponse();
    expenseShowResponse.totalAmount = expenses.reduce((acc, expense) => (acc += expense.amount), 0);
    expenseShowResponse.expensesByCategory = plainToInstance(ExpenseByCategory, expensesByCategory);
    expenseShowResponse.expenses = plainToInstance(PartialExpense, expenses);

    return expenseShowResponse;
  }
}

@Exclude()
class ExpenseByCategory {
  @Expose()
  categoryId: number;

  @Expose()
  categoryName: CategoryName;

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
