import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tx } from '@src/entity/tx.entity';
import { Category } from '@src/entity/category.entity';

import { TxService } from './service/tx.service';
import { TxQueryService } from './service/tx-query.service';
import { TxController } from './tx.controller';
import { TxLib } from './service/tx.lib';
import { CategoryLib } from '../category/service/category.lib';

@Module({
  imports: [TypeOrmModule.forFeature([Tx, Category])],
  controllers: [TxController],
  providers: [TxService, TxQueryService, TxLib, CategoryLib],
  exports: [TxLib],
})
export class TxModule {}
