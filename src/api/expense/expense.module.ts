import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExpenseService } from './service/expense.service';
import { ExpenseController } from './expense.controller';

import { Budget } from '../../entity/budget.entity';
import { Expense } from '../../entity/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, Expense])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
