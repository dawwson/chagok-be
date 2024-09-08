import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryLib } from 'src/api/category/service/category.lib';

import { Expense } from '../../../entity/expense.entity';
import { ErrorCode } from '../../../shared/enum/error-code.enum';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
    private readonly categoryLib: CategoryLib,
  ) {}

  async createExpense(expense: Expense) {
    await this.validateCategoryId(expense.categoryId);
    return this.expenseRepo.save(expense);
  }

  async updateExpense(expense: Expense) {
    await this.validateCategoryId(expense.categoryId);
    await this.expenseRepo.save(expense);
  }

  private async validateCategoryId(id: number) {
    const exist = await this.categoryLib.isExist(id);

    if (!exist) {
      throw new NotFoundException(ErrorCode.CATEGORY_NOT_FOUND);
    }
  }

  async deleteExpenseById(expenseId: number) {
    await this.expenseRepo.delete({ id: expenseId });
  }
}
