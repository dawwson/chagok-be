import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Expense } from '../../../entity/expense.entity';
import { Category } from '../../../entity/category.entity';
import { CategoryName } from '../../../shared/enum/category-name.enum';

@Injectable()
export class StatisticsExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  compareLastMonthWithThisMonth(userId: string): Promise<
    {
      categoryId: number;
      categoryName: CategoryName;
      lastMonthAmount: string;
      thisMonthAmount: string;
    }[]
  > {
    return (
      this.categoryRepo
        .createQueryBuilder('c')
        .select('c.id', 'categoryId')
        .addSelect('c.name', 'categoryName')
        // 지난 달 지출 합계
        .addSelect(
          // NOTE: 지난 달에 해당하는 지출만 집계에 포함시킵니다.
          'COALESCE(SUM(e.amount) FILTER(WHERE EXTRACT(MONTH FROM e.expenseDate) = EXTRACT(MONTH FROM CURRENT_DATE) - 1), 0)',
          'lastMonthAmount',
        )
        // 이번 달 지출 합계
        .addSelect(
          // NOTE: 이번 달에 해당하는 지출만 집계에 포함시킵니다.
          'COALESCE(SUM(amount) FILTER(WHERE EXTRACT(MONTH FROM expense_date) = EXTRACT(MONTH FROM CURRENT_DATE)), 0)',
          'thisMonthAmount',
        )
        .leftJoin(
          'expenses',
          'e',
          'c.id = e.category_id AND e.userId = :userId AND e.isExcluded = false',
          { userId },
        )
        .groupBy('c.id')
        .orderBy('c.id', 'ASC')
        .getRawMany()
    );
  }

  compareLastWeekWithThisWeek(userId: string): Promise<
    {
      categoryId: number;
      categoryName: CategoryName;
      lastWeekAmount: string;
      thisWeekAmount: string;
    }[]
  > {
    return (
      this.categoryRepo
        .createQueryBuilder('c')
        // 지난주 오늘 지출 합계
        .select('c.id', 'categoryId')
        .addSelect('c.name', 'categoryName')
        .addSelect(
          // NOTE: 지난 주 오늘(7일 전)에 해당하는 row만 집계에 포함시킵니다.
          // COALESCE : NULL -> 0으로 변환
          "COALESCE(SUM(e.amount) FILTER(WHERE EXTRACT(DAY FROM e.expenseDate) = EXTRACT(DAY FROM CURRENT_DATE - interval '7 days')), 0)",
          'lastWeekAmount',
        )
        // 오늘 지출 합계
        .addSelect(
          // NOTE: 오늘에 해당하는 row만 집계에 포함시킵니다.
          'COALESCE(SUM(e.amount) FILTER(WHERE EXTRACT(DAY FROM expense_date) = EXTRACT(DAY FROM CURRENT_DATE)), 0)',
          'thisWeekAmount',
        )
        .leftJoin(
          'expenses',
          'e',
          'c.id = e.category_id AND e.userId = :userId AND e.isExcluded = false',
          { userId },
        )
        .groupBy('c.id')
        .orderBy('c.id', 'ASC')
        .getRawMany()
    );
  }
}
