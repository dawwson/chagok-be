import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Budget } from '@src/entity/budget.entity';

import { BudgetController } from './budget.controller';
import { BudgetService } from './service/budget.service';
import { BudgetLib } from './service/budget.lib';
import { CategoryLib } from '../category/service/category.lib';
import { Category } from '@src/entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, Category])],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetLib, CategoryLib],
  exports: [BudgetLib],
})
export class BudgetModule {}
