import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { TxLib } from '../service/tx.lib';
import { RequestWithTx } from '@src/shared/interface/request-with-user.interface';
import { ErrorCode } from '@src/shared/enum/error-code.enum';

@Injectable()
export class OwnTxGuard implements CanActivate {
  constructor(private readonly txLib: TxLib) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithTx>();

    const user = request.user;
    const txId = parseInt(request.params.id);

    const tx = await this.txLib.getOwnTx(txId, user.id);

    if (!tx) {
      throw new ForbiddenException(ErrorCode.TX_FORBIDDEN);
    }

    request.tx = tx;
    return true;
  }
}
