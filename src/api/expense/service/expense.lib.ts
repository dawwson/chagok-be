import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Expense } from '@src/entity/expense.entity';

@Injectable()
export class ExpenseLib {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
  ) {}

  async isOwnExpense(id: number, userId: string) {
    return !!(await this.expenseRepo.findOneBy({ id, userId }));
  }
}
