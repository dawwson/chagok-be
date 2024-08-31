import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExpenseController } from './controller/expense.controller';
import { ExpenseService } from './service/expense.service';
import { ExpenseStatsService } from './service/expense-stats.service';
import { ExpenseQueryService } from './service/expense-query.service';
import { ExpenseLib } from './service/expense.lib';

import { CategoryLib } from '../category/service/category.lib';
import { Expense } from '../../entity/expense.entity';
import { Category } from 'src/entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Category])],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseQueryService, ExpenseStatsService, ExpenseLib, CategoryLib],
  exports: [ExpenseLib],
})
export class ExpenseModule {}
