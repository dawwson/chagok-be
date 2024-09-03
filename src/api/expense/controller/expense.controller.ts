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

import { RequestWithUser } from '../../../shared/interface/request-with-user.interface';
import { JwtAuthGuard } from '../../../shared/guard/jwt-auth.guard';

import { OwnExpenseGuard } from '../guard/own-expense.guard';
import { ExpenseService } from '../service/expense.service';
import { ExpenseStatsService } from '../service/expense-stats.service';
import { ExpenseQueryService } from '../service/expense-query.service';

import { ExpenseRegisterRequest } from './dto/request/expense-register.request';
import { ExpenseRegisterResponse } from './dto/response/expense-register.response';
import { ExpenseUpdateRequest } from './dto/request/expense-update.request';
import { ExpenseUpdateResponse } from './dto/response/expense-update.response';
import { ExpenseShowRequest } from './dto/request/expense-show.request';
import { ExpenseShowResponse } from './dto/response/expense-show.reponse';
import { GetExpenseDetailResponseData } from '../dto/get-expense-detail-response-data.dto';

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
  async updateExpense(@Param('id') expenseId: number, @Body() dto: ExpenseUpdateRequest) {
    await this.expenseService.updateExpense(dto.toEntity(expenseId));
    const expense = await this.expenseQueryService.getExpenseById(expenseId);

    return ExpenseUpdateResponse.from(expense);
  }

  @Get()
  async showExpenses(@Req() req: RequestWithUser, @Query() dto: ExpenseShowRequest) {
    const userId = req.user.id;

    const expenses = await this.expenseQueryService.getExpensesBy(userId, dto);
    const expensesByCategory = await this.expenseQueryService.getExpensesByCatogory(userId, dto);

    return ExpenseShowResponse.from(expenses, expensesByCategory);
  }

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
