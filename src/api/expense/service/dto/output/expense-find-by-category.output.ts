import { CategoryName } from '@src/shared/enum/category-name.enum';

export interface ExpenseFindByCategoryOutput {
  categoryId: number;
  categoryName: CategoryName;
  totalAmount: number;
}
