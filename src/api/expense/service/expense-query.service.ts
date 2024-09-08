import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Expense } from '@src/entity/expense.entity';
import { ErrorCode } from '@src/shared/enum/error-code.enum';

import { ExpenseShowRequest } from '../controller/dto/request/expense-show.request';
import { ExpenseFindByCategoryOutput } from './dto/output/expense-find-by-category.output';

@Injectable()
export class ExpenseQueryService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
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

    return query
      .groupBy('c.id') //
      .addGroupBy('c.name') //
      .getRawMany();
  }
}
