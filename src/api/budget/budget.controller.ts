import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiParam } from '@nestjs/swagger';

import { JwtAuthGuard } from '@src/shared/guard/jwt-auth.guard';
import { RequestWithUser } from '@src/shared/interface/request.interface';

import { BudgetCreateRequest } from './dto/request/budget-create.request';
import { BudgetCreateResponse } from './dto/response/budget-create.response';
import { BudgetFindRequest } from './dto/request/budget-find.request';
import { BudgetFindResponse } from './dto/response/budget-find.response';
import { BudgetUpdateRequest } from './dto/request/budget-update.request';
import { BudgetUpdateResponse } from './dto/response/budget-update.response';
import { BudgetRecommendRequestParam, BudgetRecommendRequestQuery } from './dto/request/budget-recommend.request';
import { BudgetRecommendResponse } from './dto/response/budget-recommend.response';
import { OwnBudgetGuard } from './guard/own-budget.guard';
import { BudgetService } from './service/budget.service';

import { CategoryLib } from '../category/service/category.lib';
import { ApiSuccessResponse } from '@src/shared/decorator/api-success-response.decorator';
import { ApiErrorResponse } from '@src/shared/decorator/api-error-response.decorator';
import { ErrorCode } from '@src/shared/enum/error-code.enum';

@ApiHeader({ name: 'Cookie', description: 'accessToken=`JWT`' })
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetController {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly categoryLib: CategoryLib,
  ) {}

  // ✅ 예산 생성
  @ApiOperation({
    summary: '예산 생성',
    description: [
      '- 새로운 월별 예산을 생성합니다.',
      '- `amount`를 `0`으로 설정한 카테고리의 예산도 모두 포함하여 요청합니다.',
      '- 해당 연도/월에 이미 예산이 있는 경우 실패 응답을 반환합니다.',
    ].join('\n'),
  })
  @ApiSuccessResponse({ status: 201, type: BudgetCreateResponse })
  @ApiErrorResponse('POST /budgets', [
    {
      status: 400,
      description: '예산의 총액이 서버에서 정의한 범위를 벗어남',
      errorCode: ErrorCode.BUDGET_TOTAL_AMOUNT_OUT_OF_RANGE,
    },
    {
      status: 404,
      description: 'categoryId가 지출 카테고리가 아닌 경우',
      errorCode: ErrorCode.CATEGORY_NOT_FOUND,
    },
    {
      status: 409,
      description: '이미 등록된 예산',
      errorCode: ErrorCode.BUDGET_IS_DUPLICATED,
    },
  ])
  @Post()
  async registerBudget(@Req() req: RequestWithUser, @Body() dto: BudgetCreateRequest) {
    const userId = req.user.id;
    const budget = await this.budgetService.createBudget({ userId, ...dto });

    return BudgetCreateResponse.from(budget);
  }

  // ✅ 예산 수정
  @ApiOperation({
    summary: '예산 수정',
    description: [
      '- 예산을 일괄 수정합니다.', //
      '- 모든 카테고리의 예산을 포함하여 요청합니다.',
    ].join('\n'),
  })
  @ApiParam({ name: 'id', description: '예산 고유 식별자' })
  @ApiSuccessResponse({ status: 200, type: BudgetUpdateResponse })
  @ApiErrorResponse('PUT /budgets/{id}', [
    {
      status: 400,
      description: '예산의 총액이 서버에서 정의한 범위를 벗어남',
      errorCode: ErrorCode.BUDGET_TOTAL_AMOUNT_OUT_OF_RANGE,
    },
    {
      status: 404,
      description: 'categoryId가 지출 카테고리가 아닌 경우',
      errorCode: ErrorCode.CATEGORY_NOT_FOUND,
    },
  ])
  @UseGuards(OwnBudgetGuard)
  @Put(':id')
  async updateBudget(@Param('id') budgetId: number, @Body() dto: BudgetUpdateRequest) {
    await this.budgetService.updateBudget(budgetId, dto);
    const budget = await this.budgetService.getBudgetById(budgetId);

    return BudgetUpdateResponse.from(budget);
  }

  // ✅ 예산 조회
  @ApiOperation({
    summary: '예산 조회',
    description: [
      '- 특정 연도/달의 예산을 조회합니다.', //
      '- 예산이 없는 경우 `id`는 `null`, `amount`는 `0`으로 지정하여 보냅니다.',
    ].join('\n'),
  })
  @ApiSuccessResponse({ status: 200, type: BudgetFindResponse })
  @Get(':year/:month')
  async findBudget(@Req() req: RequestWithUser, @Param() { year, month }: BudgetFindRequest) {
    const userId = req.user.id;
    const budget = await this.budgetService.getOwnBudgetByYearAndMonth(userId, year, month);

    if (!budget) {
      const categories = await this.categoryLib.getExpenseCategories();
      return BudgetFindResponse.emptyBudgetFrom(year, month, categories);
    }

    return BudgetFindResponse.from(budget);
  }

  // ✅ 예산 추천
  @ApiOperation({
    summary: '예산 추천',
    description: [
      '- 카테고리별 예산을 자동 생성하여 반환합니다.',
      '- 모든 카테고리에 대한 예산이 반환됩니다.',
      '추천받고자 하는 연도/월 직전 6개월 동안의 예산이 없다면 빈 배열로 반환합니다.',
    ].join('\n'),
  })
  @ApiSuccessResponse({ status: 200, type: BudgetRecommendResponse })
  @Get(':year/:month/recommendation')
  async recommendBudget(
    @Req() req: RequestWithUser,
    @Param() param: BudgetRecommendRequestParam,
    @Query() query: BudgetRecommendRequestQuery,
  ) {
    const userId = req.user.id;
    const recommendation = await this.budgetService.getBudgetRecommendation({
      userId,
      year: param.year,
      month: param.month,
      totalAmount: query.totalAmount,
    });

    return BudgetRecommendResponse.from(param.year, param.month, recommendation);
  }
}
