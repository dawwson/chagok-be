import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { UpdateExpenseResponseData } from '../dto/update-expense-response-data.dto';
import { UpdateExpenseRequestBody } from '../dto/update-expense-request-body.dto';
import { GetExpensesListRequestQuery } from '../dto/get-expenses-list-request-query.dto';
import { GetExpensesListResponseData } from '../dto/get-expenses-list-reponse-data.dto';
import { GetExpenseDetailResponseData } from '../dto/get-expense-detail-response-data.dto';

import { ExpenseService } from '../service/expense.service';
import { ExpenseStatsService } from '../service/expense-stats.service';

import { RequestWithUser } from '../../../shared/interface/request-with-user.interface';
import { JwtAuthGuard } from '../../../shared/guard/jwt-auth.guard';
import { OwnExpenseGuard } from '../guard/own-expense.guard';
import { ExpenseRegisterResponse } from './dto/response/expense-register.response';
import { ExpenseRegisterRequest } from './dto/request/expense-register.request';
import { ExpenseQueryService } from '../service/expense-query.service';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpenseController {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly expenseStatsService: ExpenseStatsService,
    private readonly expenseQueryService: ExpenseQueryService,
  ) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async registerExpense(@Req() req: RequestWithUser, @Body() dto: ExpenseRegisterRequest) {
    const expense = await this.expenseService.createExpense(dto.toEntity(req.user.id));

    return new ExpenseRegisterResponse(expense);
  }

  @UseGuards(OwnExpenseGuard)
  @Patch(':id')
  async updateExpense(@Param('id') id: number, @Body() dto: UpdateExpenseRequestBody) {
    // 지출 수정
    await this.expenseService.updateExpenseById(id, dto.toUpdateExpenseResource());

    // 수정된 지출 조회
    const expense = await this.expenseQueryService.getExpenseById(id);

    return UpdateExpenseResponseData.of(expense);
  }

  // @Get()
  // async getExpensesList(@Req() req: RequestWithUser, @Query() dto: GetExpensesListRequestQuery) {
  //   const expenses = await this.expenseService.getExpensesWithCondition(dto.toGetExpensesCondition(req.user.id));

  //   const categoriesWithTotalAmount = await this.expenseService.getCategoriesWithTotalAmount(
  //     dto.toGetCategoriesWithTotalAmountCondition(req.user.id),
  //   );
  //   return GetExpensesListResponseData.of(expenses, categoriesWithTotalAmount);
  // }

  @Get('statistics')
  async getExpenseStatistics(@Req() req: RequestWithUser) {
    // 지난달, 이번달 카테고리별 지출 합계
    const monthStatisticsByCategory = await this.expenseStatsService.compareLastMonthWithThisMonth(req.user.id);

    // 7일 전, 오늘 카테고리별 지출 합계
    const weekStatisticsByCategory = await this.expenseStatsService.compareLastWeekWithThisWeek(req.user.id);
    return {
      comparedToLastMonth: monthStatisticsByCategory.map((statistic) => ({
        ...statistic,
        // string -> number로 변환
        lastMonthAmount: Number(statistic.lastMonthAmount),
        thisMonthAmount: Number(statistic.thisMonthAmount),
      })),
      comparedToLastWeek: weekStatisticsByCategory.map((statistic) => ({
        ...statistic,
        // string -> number로 변환
        lastWeekAmount: Number(statistic.lastWeekAmount),
        thisWeekAmount: Number(statistic.thisWeekAmount),
      })),
    };
  }

  @UseGuards(OwnExpenseGuard)
  @Get(':id')
  async getExpenseDetail(@Param('id') id: number) {
    const expense = await this.expenseQueryService.getExpenseById(id);

    return GetExpenseDetailResponseData.of(expense);
  }

  @UseGuards(OwnExpenseGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteExpense(@Param('id') id: number) {
    await this.expenseQueryService.deleteExpenseById(id);
    return;
  }
}
