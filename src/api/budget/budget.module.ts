import { Module } from '@nestjs/common';
import { SetBudgetService } from './service/set-budget.service';
import { BudgetController } from './budget.controller';
import { RecommendBudgetService } from './service/recommend-budget.service';

@Module({
  controllers: [BudgetController],
  providers: [SetBudgetService, RecommendBudgetService],
})
export class BudgetModule {}
