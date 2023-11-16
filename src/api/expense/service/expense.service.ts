import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateExpenseResource } from '../dto/create-expense-resource.dto';

import { Expense } from '../../../entity/expense.entity';
import { Category } from '../../../entity/category.entity';
import { FailMessage } from '../../../shared/enum/fail-message.enum';
import { UpdateExpenseResource } from '../dto/update-expense-resource.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Expense>,
  ) {}

  async createExpenseData(
    createExpenseResource: CreateExpenseResource,
  ): Promise<Expense> {
    const category = await this.categoryRepo.findOneBy({
      id: createExpenseResource.categoryId,
    });

    if (!category) {
      throw new BadRequestException(FailMessage.EXPENSE_INVALID_CATEGORY_ID);
    }

    return this.expenseRepo.save(
      this.expenseRepo.create({ ...createExpenseResource }),
    );
  }

  async updateExpenseById(
    id: number,
    dto: UpdateExpenseResource,
  ): Promise<void> {
    await this.expenseRepo.update({ id }, dto);
  }

  getExpenseById(id: number): Promise<Expense> {
    return this.expenseRepo.findOneBy({ id });
  }
}
