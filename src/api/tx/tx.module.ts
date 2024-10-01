import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryLib } from '../category/service/category.lib';
import { TxService } from './service/tx.service';
import { TxQueryService } from './service/tx-query.service';
import { TxController } from './tx.controller';

import { Tx } from '@src/entity/tx.entity';
import { Category } from '@src/entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tx, Category])],
  controllers: [TxController],
  providers: [TxService, TxQueryService, CategoryLib],
})
export class TxModule {}
