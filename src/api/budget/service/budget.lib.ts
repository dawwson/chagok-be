import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Budget } from '@src/entity/budget.entity';

@Injectable()
export class BudgetLib {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepo: Repository<Budget>,
  ) {}

  getOwnBudget(id: number, userId: string) {
    return this.budgetRepo.findOneBy({ id, userId });
  }
}
