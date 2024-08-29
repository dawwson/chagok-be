import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetExpensesCondition } from '../dto/get-expenses-condition.dto';
import { GetCategoriesWithTotalAmountCondition } from '../dto/get-categories-with-total-amount-condition.dto';

import { Expense } from '../../../entity/expense.entity';
import { Category } from '../../../entity/category.entity';

@Injectable()
export class ExpenseQueryService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  getExpensesWithCondition({
    userId,
    startDate,
    categoryId,
    endDate,
    minAmount,
    maxAmount,
  }: GetExpensesCondition): Promise<Expense[]> {
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

  getCategoriesWithTotalAmount({
    userId,
    startDate,
    endDate,
    minAmount,
    maxAmount,
  }: GetCategoriesWithTotalAmountCondition): Promise<Category[]> {
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
  }

  getExpenseById(id: number): Promise<Expense> {
    return this.expenseRepo.findOneBy({ id });
  }

  async deleteExpenseById(id: number): Promise<void> {
    await this.expenseRepo.delete({ id });
  }
}
