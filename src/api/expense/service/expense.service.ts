import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateExpenseResource } from '../dto/update-expense-resource.dto';

import { Expense } from '../../../entity/expense.entity';
import { ErrorCode } from '../../../shared/enum/error-code.enum';
import { CategoryLib } from 'src/api/category/service/category.lib';

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

  async updateExpenseById(id: number, dto: UpdateExpenseResource) {
    await this.validateCategoryId(dto.categoryId);
    await this.expenseRepo.update({ id }, dto);
  }

  private async validateCategoryId(id: number) {
    const exist = await this.categoryLib.isExist(id);

    if (!exist) {
      throw new BadRequestException(ErrorCode.INVALID_CATEGORY_ID);
    }
  }
}
