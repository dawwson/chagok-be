import { Module } from '@nestjs/common';
import { ExpenseService } from './service/expense.service';
import { ExpenseController } from './expense.controller';

@Module({
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
