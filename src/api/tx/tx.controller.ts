import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@src/shared/guard/jwt-auth.guard';
import { RequestWithTx, RequestWithUser } from '@src/shared/interface/request-with-user.interface';

import { TxRegisterRequest } from './dto/request/tx-register.request';
import { TxRegisterResponse } from './dto/response/tx-register.response';
import { TxShowRequest } from './dto/request/tx-show.request';
import { TxShowResponse } from './dto/response/tx-show.reponse';
import { TxSumRequest } from './dto/request/tx-sum.request';
import { TxSumResponse } from './dto/response/tx-sum.reponse';
import { TxShowDetailResponse } from './dto/response/tx-show-detail.response';

import { TxService } from './service/tx.service';
import { TxQueryService } from './service/tx-query.service';
import { OwnTxGuard } from './guard/own-tx.guard';

@UseGuards(JwtAuthGuard)
@Controller('txs')
export class TxController {
  constructor(
    private readonly txService: TxService,
    private readonly txQueryService: TxQueryService,
  ) {}

  @Post()
  async registerTx(@Req() req: RequestWithUser, @Body() dto: TxRegisterRequest) {
    const userId = req.user.id;
    const newTx = await this.txService.createTx(dto.toEntity(userId));

    return TxRegisterResponse.from(newTx);
  }

  @Get()
  async showTxs(@Req() req: RequestWithUser, @Query() dto: TxShowRequest) {
    const userId = req.user.id;
    const txs = await this.txQueryService.getTxs(userId, dto);

    return TxShowResponse.from(txs);
  }

  @Get('/sum')
  async showTxsSum(@Req() req: RequestWithUser, @Query() dto: TxSumRequest) {
    const userId = req.user.id;
    const sum = await this.txQueryService.calculateSum(userId, dto);

    return TxSumResponse.from(sum.totalIncome, sum.totalExpense);
  }

  @UseGuards(OwnTxGuard)
  @Get('/:id')
  showTx(@Req() req: RequestWithTx) {
    const tx = req.tx;
    return TxShowDetailResponse.from(tx);
  }
}
