import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@src/shared/guard/jwt-auth.guard';
import { RequestWithUser } from '@src/shared/interface/request.interface';

import { StatExpenseRequestParam, StatExpenseRequestQuery } from './dto/request/stat-expense.request';
import { StatExpenseResponse } from './dto/response/stat-expense.response';

import { StatService } from './stat.service';

@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get('expense/:year/:month')
  async getExpenseStat(
    @Req() req: RequestWithUser,
    @Param() { year, month }: StatExpenseRequestParam,
    @Query() { view }: StatExpenseRequestQuery,
  ): Promise<StatExpenseResponse[]> {
    const userId = req.user.id;
    const stats = await this.statService.getExpenseStats({ userId, year, month, view });

    return stats;
  }
}
