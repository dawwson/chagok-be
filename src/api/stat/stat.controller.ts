import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation } from '@nestjs/swagger';

import { ApiSuccessResponse } from '@src/shared/decorator/api-success-response.decorator';
import { JwtAuthGuard } from '@src/shared/guard/jwt-auth.guard';
import { RequestWithUser } from '@src/shared/interface/request.interface';

import { StatExpenseRequestParam, StatExpenseRequestQuery } from './dto/request/stat-expense.request';
import { StatExpenseResponse } from './dto/response/stat-expense.response';

import { StatService } from './stat.service';

@ApiHeader({ name: 'Cookie', description: 'accessToken=`JWT`' })
@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatController {
  constructor(private readonly statService: StatService) {}

  // ✅ 지출 통계 조회
  @ApiOperation({
    summary: '지출 통계 조회',
    description: [
      '- 전년도 동월 대비 & 전월 대비 카테고리별 지출 통계를 조회합니다.',
      '- 통계 제외 처리한 내역은 통계에서 제외되지만, 내역 목록 조회 API 응답에는 포함됩니다.',
    ].join('\n'),
  })
  @ApiSuccessResponse({ status: 200, type: StatExpenseResponse, isArray: true })
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
