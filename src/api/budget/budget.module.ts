import { Module } from '@nestjs/common';
import { BudgetService } from './service/budget.service';
import { BudgetController } from './budget.controller';
import { BudgetRecommendationService } from './service/budget-recommendation.service';

@Module({
  controllers: [BudgetController],
  providers: [BudgetService, BudgetRecommendationService],
})
export class BudgetModule {}
