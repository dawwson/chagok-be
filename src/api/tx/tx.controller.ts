import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@src/shared/guard/jwt-auth.guard';
import { RequestWithUser } from '@src/shared/interface/request-with-user.interface';

import { TxRegisterRequest } from './dto/request/tx-register.request';
import { TxRegisterResponse } from './dto/response/tx-register.response';

import { TxService } from './service/tx.service';

@UseGuards(JwtAuthGuard)
@Controller('txs')
export class TxController {
  constructor(private readonly txService: TxService) {}

  @Post('/')
  async registerTx(@Req() req: RequestWithUser, @Body() dto: TxRegisterRequest) {
    const userId = req.user.id;
    const newTx = await this.txService.createTx(dto.toEntity(userId));

    return TxRegisterResponse.from(newTx);
  }
}
