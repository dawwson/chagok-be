import { Tx } from '@src/entity/tx.entity';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    nickname: string;
  };
}

export interface RequestWithTx extends RequestWithUser {
  tx: Tx;
}
