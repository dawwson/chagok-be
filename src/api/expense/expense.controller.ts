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
} from '@nestjs/common';

import { CreateExpenseRequestBody } from './dto/create-expense-request-body.dto';
import { CreateExpenseResponseData } from './dto/create-expense-response-data.dto';
import { UpdateExpenseResponseData } from './dto/update-expense-response-data.dto';
import { UpdateExpenseRequestBody } from './dto/update-expense-request-body.dto';
import { GetExpensesListRequestQuery } from './dto/get-expenses-list-request-query.dto';
import { GetExpensesListResponseData } from './dto/get-expenses-list-reponse-data.dto';
import { GetExpenseDetailResponseData } from './dto/get-expense-detail-response-data.dto';

import { ExpenseService } from './service/expense.service';
import { StatisticsExpenseService } from './service/statistics-expense.service';

import { RequestWithUser } from '../../shared/interface/request-with-user.interface';
import { JwtAuthGuard } from '../../shared/guard/jwt-auth.guard';
import { OwnExpenseGuard } from './guard/own-expense.guard';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpenseController {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly statisticsExpenseService: StatisticsExpenseService,
  ) {}

  @Post()
  async createExpense(
    @Req() req: RequestWithUser,
    @Body() dto: CreateExpenseRequestBody,
  ) {
    const expense = await this.expenseService.createExpenseData(
      dto.toCreateExpenseResource(req.user.id),
    );
    return CreateExpenseResponseData.of(expense);
  }

  @UseGuards(OwnExpenseGuard)
  @Patch(':id')
  async updateExpense(
    @Param('id') id: number,
    @Body() dto: UpdateExpenseRequestBody,
  ) {
    // 지출 수정
    await this.expenseService.updateExpenseById(
      id,
      dto.toUpdateExpenseResource(),
    );

    // 수정된 지출 조회
    const expense = await this.expenseService.getExpenseById(id);

    return UpdateExpenseResponseData.of(expense);
  }

  @Get()
  async getExpensesList(
    @Req() req: RequestWithUser,
    @Query() dto: GetExpensesListRequestQuery,
  ) {
    const expenses = await this.expenseService.getExpensesWithCondition(
      dto.toGetExpensesCondition(req.user.id),
    );

    const categoriesWithTotalAmount =
      await this.expenseService.getCategoriesWithTotalAmount(
        dto.toGetCategoriesWithTotalAmountCondition(req.user.id),
      );
    return GetExpensesListResponseData.of(expenses, categoriesWithTotalAmount);
  }

  @Get('statistics')
  async getExpenseStatistics(@Req() req: RequestWithUser) {
    // 지난달, 이번달 카테고리별 지출 합계
    const monthStatisticsByCategory =
      await this.statisticsExpenseService.compareLastMonthWithThisMonth(
        req.user.id,
      );

    // 7일 전, 오늘 카테고리별 지출 합계
    const weekStatisticsByCategory =
      await this.statisticsExpenseService.compareLastWeekWithThisWeek(
        req.user.id,
      );
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
    const expense = await this.expenseService.getExpenseById(id);

    return GetExpenseDetailResponseData.of(expense);
  }

  @UseGuards(OwnExpenseGuard)
  @Delete(':id')
  async deleteExpense(@Param('id') id: number) {
    await this.expenseService.deleteExpenseById(id);
    return;
  }
}
