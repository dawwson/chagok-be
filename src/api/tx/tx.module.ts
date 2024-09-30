import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TxService } from './service/tx.service';
import { TxController } from './tx.controller';
import { CategoryLib } from '../category/service/category.lib';

import { Tx } from '@src/entity/tx.entity';
import { Category } from '@src/entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tx, Category])],
  controllers: [TxController],
  providers: [TxService, CategoryLib],
})
export class TxModule {}
