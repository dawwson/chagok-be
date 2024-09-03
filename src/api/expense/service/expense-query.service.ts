import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Expense } from '../../../entity/expense.entity';
import { Category } from '../../../entity/category.entity';
import { ErrorCode } from 'src/shared/enum/error-code.enum';

import { ExpenseShowRequest } from '../controller/dto/request/expense-show.request';
import { ExpenseFindByCategoryOutput } from './dto/output/expense-find-by-category.output';

@Injectable()
export class ExpenseQueryService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async getExpenseById(expenseId: number) {
    const expense = await this.expenseRepo.findOneBy({ id: expenseId });

    if (!expense) {
      throw new NotFoundException(ErrorCode.EXPENSE_NOT_FOUND);
    }

    return expense;
  }

  getExpensesBy(userId: string, dto: ExpenseShowRequest) {
    const { startDate, categoryId, endDate, minAmount, maxAmount } = dto;

    const query = this.expenseRepo
      .createQueryBuilder('e')
      .select() // 지출 모든 컬럼 조회
      .addSelect('c.id')
      .addSelect('c.name')
      .innerJoin('e.category', 'c')
      .where('e.userId = :userId', { userId })
      .andWhere('e.isExcluded = false')
      .andWhere('(e.expenseDate >= :startDate AND e.expenseDate <= :endDate)', {
        startDate,
        endDate,
      });

    if (categoryId) {
      query.andWhere('e.categoryId = :categoryId', { categoryId });
    }

    if (minAmount && maxAmount) {
      query.andWhere('(e.amount >= :minAmount AND e.amount <= :maxAmount)', {
        minAmount,
        maxAmount,
      });
    }

    return query
      .orderBy('e.expenseDate', 'DESC') // 최신 지출 순
      .getMany();
  }

  getExpensesByCatogory(userId: string, dto: ExpenseShowRequest): Promise<ExpenseFindByCategoryOutput[]> {
    const { startDate, endDate, minAmount, maxAmount } = dto;

    const query = this.expenseRepo
      .createQueryBuilder('e')
      .select('c.id', 'categoryId')
      .addSelect('c.name', 'categoryName')
      .addSelect('SUM(e.amount)', 'totalAmount')
      .innerJoin('categories', 'c', 'e.categoryId = c.id')
      .where('e.userId = :userId', { userId })
      .andWhere('e.isExcluded = false')
      .andWhere('(e.expenseDate >= :startDate AND e.expenseDate <= :endDate)', { startDate, endDate });

    if (minAmount !== undefined && maxAmount !== undefined) {
      query.andWhere('(e.amount >= :minAmount AND e.amount <= :maxAmount)', {
        minAmount,
        maxAmount,
      });
    }

    return query.groupBy('c.id').addGroupBy('c.name').getRawMany();

    // SELECT
    //     "c"."id" AS "categoryId",
    //     "c"."name" AS "categoryName",
    //     SUM("e"."amount") AS "totalAmount"
    // FROM
    //     "expenses" "e"
    //     INNER JOIN "categories" "c" ON "e"."category_id" = "c"."id"
    // WHERE
    //     "e"."user_id" = '41f116c2-c9f5-4ee3-90e0-b9315f4fee7d'
    //     AND "e"."is_excluded" = FALSE
    //     AND ("e"."expense_date" >= '2024-08-16T00:00:00.000Z'
    //         AND "e"."expense_date" <= '2024-09-20T00:00:00.000Z')
    // GROUP BY
    //     "c"."id", "c"."name";

    /*
    const query = this.categoryRepo
      .createQueryBuilder('c')
      .select('c.id', 'id')
      .addSelect('c.name', 'name')
      .addSelect('SUM(e.amount)', 'totalAmount')
      .innerJoin('expenses', 'e', 'e.categoryId = c.id')
      .where('e.userId = :userId', { userId })
      .andWhere('e.isExcluded = false')
      .andWhere('(e.expenseDate >= :startDate AND e.expenseDate <= :endDate)', {
        startDate,
        endDate,
      });

    if (minAmount && maxAmount) {
      query.andWhere('(e.amount >= :minAmount AND e.amount <= :maxAmount)', {
        minAmount,
        maxAmount,
      });
    }
    return query
      .groupBy('c.id') //
      .getRawMany();
*/
  }

  async deleteExpenseById(id: number): Promise<void> {
    await this.expenseRepo.delete({ id });
  }
}
