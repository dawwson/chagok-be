import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateExpenseResource } from '../dto/create-expense-resource.dto';

import { Expense } from '../../../entity/expense.entity';
import { Budget } from '../../../entity/budget.entity';
import { BudgetMonth } from '../../../shared/enum/budget-month.enum';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
  ) {}

  async createExpenseData(
    createExpenseResource: CreateExpenseResource,
  ): Promise<Expense> {
    return this.expenseRepo.save(
      this.expenseRepo.create({ ...createExpenseResource }),
    );
  }

  extractMonth(date: Date) {
    return Object.values(BudgetMonth)[date.getUTCMonth()];
  }

  extractYear(date: Date) {
    return date.getUTCFullYear().toString();
  }
}
