import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Budget } from '@src/entity/budget.entity';
import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { BudgetCreateInput } from '../dto/input/budget-create.input';
import { BudgetCategory } from '@src/entity/budget-category.entity';
import { CategoryLib } from '@src/api/category/service/category.lib';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepo: Repository<Budget>,
    private readonly categoryLib: CategoryLib,
  ) {}

  getOwnBudgetByYearAndMonth(userId: string, year: number, month: number) {
    return this.budgetRepo.findOne({
      where: { userId, year, month },
      relations: ['budgetCategories', 'budgetCategories.category'],
    });
  }

  async createBudget(dto: BudgetCreateInput) {
    const { userId, year, month, budgets } = dto;

    // 모두 지출 카테고리인지 검증
    await this.categoryLib.validateExpenseCategory(budgets.map((b) => b.categoryId));

    const budgetCategories = budgets.map((b) => {
      return BudgetCategory.builder() //
        .categoryId(b.categoryId) //
        .amount(b.amount)
        .build();
    });

    const budget = Budget.builder() //
      .userId(userId) //
      .year(year) //
      .month(month) //
      .budgetCategories(budgetCategories) //
      .build();

    try {
      return await this.budgetRepo.save(budget);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(ErrorCode.BUDGET_IS_DUPLICATED);
      }
    }
  }
}
