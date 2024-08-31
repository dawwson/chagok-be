import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { CategoryLib } from './service/category.lib';

import { Category } from '../../entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryLib],
  exports: [CategoryLib],
})
export class CategoryModule {}
