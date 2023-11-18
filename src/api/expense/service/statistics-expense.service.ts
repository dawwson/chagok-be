import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Expense } from '../../../entity/expense.entity';
import { Category } from '../../../entity/category.entity';

@Injectable()
export class StatisticsExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  compareLastMonthWithThisMonth(userId: string): Promise<{
    lastMonthAmount: string | null;
    thisMonthAmount: string | null;
  }> {
    return (
      this.expenseRepo
        .createQueryBuilder('e')
        // 지난 달 지출 합계
        .select(
          // NOTE: 지난 달에 해당하는 지출만 집계에 포함시킵니다.
          'SUM(e.amount) FILTER(WHERE EXTRACT(MONTH FROM e.expenseDate) = EXTRACT(MONTH FROM CURRENT_DATE) - 1)',
          'lastMonthAmount',
        )
        // 이번 달 지출 합계
        .addSelect(
          // NOTE: 이번 달에 해당하는 지출만 집계에 포함시킵니다.
          'SUM(amount) FILTER(WHERE EXTRACT(MONTH FROM expense_date) = EXTRACT(MONTH FROM CURRENT_DATE))',
          'thisMonthAmount',
        )
        .where('e.userId = :userId', { userId })
        .andWhere('e.isExcluded = false')
        .getRawOne()
    );
  }

  compareLastWeekWithThisWeek(userId: string): Promise<{
    lastWeekAmount: string | null;
    thisWeekAmount: string | null;
  }> {
    return (
      this.expenseRepo
        .createQueryBuilder('e')
        // 지난 달 지출 합계
        .select(
          // NOTE: 지난 주 오늘(7일 전)에 해당하는 row만 집계에 포함시킵니다.
          "SUM(e.amount) FILTER(WHERE EXTRACT(DAY FROM e.expenseDate) = EXTRACT(DAY FROM CURRENT_DATE - interval '7 days'))",
          'lastWeekAmount',
        )
        // 이번 달 지출 합계
        .addSelect(
          // NOTE: 오늘에 해당하는 row만 집계에 포함시킵니다.
          'SUM(e.amount) FILTER(WHERE EXTRACT(DAY FROM expense_date) = EXTRACT(DAY FROM CURRENT_DATE))',
          'thisWeekAmount',
        )
        .where('e.userId = :userId', { userId })
        .andWhere('e.isExcluded = false')
        .getRawOne()
    );
  }
}
