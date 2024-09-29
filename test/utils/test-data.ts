import { User } from '@src/entity/user.entity';
import { Category } from '@src/entity/category.entity';
import { CategoryName } from '@src/shared/enum/category-name.enum';
import { Expense } from '@src/entity/expense.entity';

export const testUsers: User[] = [
  // 사용자 1
  {
    id: '18ced157-af28-4f06-94f3-a0a7192dcb68',
    email: 'test1@gmail.com',
    password: 'test1',
    nickname: 'test1',
  },
  // 사용자 2
  {
    id: '9e9f3460-cf67-4222-803b-71e4bd567594',
    email: 'test2@gmail.com',
    password: 'test2',
    nickname: 'test2',
  },
] as User[];

/*
export const testCategories: Category[] = Object.values(CategoryName).map(
  (name, index) => ({ id: index + 1, name }) as Category,
);

export const testExpenses: Expense[] = [
  // 사용자 1의 지출
  {
    id: 1,
    userId: testUsers[0].id,
    categoryId: testCategories[0].id,
    content: '엽떡',
    amount: 14000,
    isExcluded: false,
    expenseDate: new Date(),
  },
  {
    id: 2,
    userId: testUsers[0].id,
    categoryId: testCategories[1].id,
    content: '택시비',
    amount: 10000,
    isExcluded: false,
    expenseDate: new Date(),
  },
  // 사용자 2의 지출
  {
    id: 3,
    userId: testUsers[1].id,
    categoryId: testCategories[3].id,
    content: '병원 갔다옴',
    amount: 5000,
    isExcluded: false,
    expenseDate: new Date(),
  },
] as Expense[];
*/
