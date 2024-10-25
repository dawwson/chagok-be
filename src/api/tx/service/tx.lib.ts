import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tx } from '@src/entity/tx.entity';

@Injectable()
export class TxLib {
  constructor(
    @InjectRepository(Tx)
    private readonly txRepo: Repository<Tx>,
  ) {}

  getOwnTx(id: number, userId: string) {
    return this.txRepo.findOneBy({ id, userId });
  }
}
