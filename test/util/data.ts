import * as dayjs from 'dayjs';

import { User } from '@src/entity/user.entity';
import { Category } from '@src/entity/category.entity';
import { Tx } from '@src/entity/tx.entity';

import { IncomeCategoryName, ExpenseCategoryName } from '@src/shared/enum/category-name.enum';
import { TxType } from '@src/shared/enum/tx-type.enum';
import { TxMethod } from '@src/shared/enum/tx-method.enum';
import { Budget } from '@src/entity/budget.entity';
import { BudgetCategory } from '@src/entity/budget-category.entity';

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

const incomeCategories = Object.keys(IncomeCategoryName).map((key, i) => {
  const c = new Category();
  c.id = i + 1;
  c.name = IncomeCategoryName[key];
  c.type = TxType.INCOME;
  return c;
});

export const expenseCategories = Object.keys(ExpenseCategoryName).map((key, i) => {
  const c = new Category();
  c.id = incomeCategories.length + i + 1;
  c.name = ExpenseCategoryName[key];
  c.type = TxType.EXPENSE;
  return c;
});

export const testCategories: Category[] = [...incomeCategories, ...expenseCategories];

export const testTxs: Tx[] = [
  // 사용자 1의 내역
  {
    id: 1,
    userId: testUsers[0].id,
    categoryId: testCategories[0].id,
    txType: TxType.INCOME,
    txMethod: TxMethod.BANK_TRANSFER,
    amount: 3000000,
    date: new Date(),
    description: '급여',
    isExcluded: false,
  },
  // 사용자 2의 내역
  {
    id: 2,
    userId: testUsers[1].id,
    categoryId: testCategories[0].id,
    txType: TxType.EXPENSE,
    txMethod: TxMethod.CREDIT_CARD,
    amount: 5000,
    date: new Date(),
    description: '커피',
    isExcluded: false,
  },
] as Tx[];

const testBudgetCategories: BudgetCategory[] = expenseCategories.map((c, index) =>
  BudgetCategory.builder()
    .categoryId(c.id)
    .amount(100000 * index)
    .build(),
);

export const testBudgets: Budget[] = [
  Budget.builder()
    .id(1)
    .userId(testUsers[0].id)
    .year(dayjs().year())
    .month(dayjs().month() + 1)
    .totalAmount(testBudgetCategories.reduce((acc, bc) => (acc += bc.amount), 0))
    .budgetCategories(testBudgetCategories)
    .build(),
];
