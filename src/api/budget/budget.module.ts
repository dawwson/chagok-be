import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from '@src/entity/category.entity';
import { Budget } from '@src/entity/budget.entity';

import { BudgetController } from './controller/budget.controller';
import { SetBudgetService } from './service/set-budget.service';
import { RecommendBudgetService } from './service/recommend-budget.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Budget])],
  controllers: [BudgetController],
  providers: [SetBudgetService, RecommendBudgetService],
})
export class BudgetModule {}
