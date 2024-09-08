import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from '@src/entity/category.entity';

import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { CategoryLib } from './service/category.lib';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryLib],
  exports: [CategoryLib],
})
export class CategoryModule {}
