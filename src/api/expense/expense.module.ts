import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExpenseService } from './service/expense.service';
import { StatisticsExpenseService } from './service/statistics-expense.service';
import { ExpenseController } from './expense.controller';

import { Expense } from '../../entity/expense.entity';
import { Category } from '../../entity/category.entity';
import { ExpenseLib } from './service/expense.lib';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Category])],
  controllers: [ExpenseController],
  providers: [ExpenseService, StatisticsExpenseService, ExpenseLib],
  exports: [ExpenseLib],
})
export class ExpenseModule {}
