import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryLib } from '@src/api/category/service/category.lib';
import { Tx } from '@src/entity/tx.entity';

import { TxUpdateInput } from '../dto/input/tx-update.input';

@Injectable()
export class TxService {
  constructor(
    @InjectRepository(Tx)
    private readonly txRepo: Repository<Tx>,
    private readonly categoryLib: CategoryLib,
  ) {}

  async createTx(tx: Tx) {
    await this.categoryLib.validateCategoryId(tx.categoryId);
    return this.txRepo.save(tx);
  }

  async updateTx(txId: number, dto: TxUpdateInput) {
    await this.categoryLib.validateCategoryId(dto.categoryId);
    await this.txRepo.update(txId, dto);
  }

  deleteTx(txId: number) {}
}
