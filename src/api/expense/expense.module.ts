import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExpenseStatsService } from './service/expense-stats.service';
import { ExpenseService } from './service/expense.service';
import { ExpenseController } from './controller/expense.controller';

import { Expense } from '../../entity/expense.entity';
import { Category } from '../../entity/category.entity';
import { ExpenseLib } from './service/expense.lib';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Category])],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseStatsService, ExpenseLib],
  exports: [ExpenseLib],
})
export class ExpenseModule {}
