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
import { GetExpenseDetailResponseData } from './dto/get-expense-detail-response-data.dto';

import { ExpenseService } from './service/expense.service';

import { SuccessMessage } from '../../shared/enum/success-message.enum';
import { RequestWithUser } from '../../shared/interface/request-with-user.interfact';
import { JwtAuthGuard } from '../../shared/guard/jwt-auth.guard';
import { OwnExpenseGuard } from './guard/own-expense.guard';
import { GetExpensesListResponseData } from './dto/get-expenses-list-reponse-data.dto';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async createExpense(
    @Req() req: RequestWithUser,
    @Body() dto: CreateExpenseRequestBody,
  ) {
    const expense = await this.expenseService.createExpenseData(
      dto.toCreateExpenseResource(req.user.id),
    );
    return {
      message: SuccessMessage.EXPENSE_CREATE,
      data: CreateExpenseResponseData.of(expense),
    };
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

    return {
      message: SuccessMessage.EXPENSE_UPDATE,
      data: UpdateExpenseResponseData.of(expense),
    };
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
    return {
      message: SuccessMessage.EXPENSE_GET_LIST,
      data: GetExpensesListResponseData.of(expenses, categoriesWithTotalAmount),
    };
  }

  @UseGuards(OwnExpenseGuard)
  @Get(':id')
  async getExpenseDetail(@Param('id') id: number) {
    const expense = await this.expenseService.getExpenseById(id);

    return {
      message: SuccessMessage.EXPENSE_GET_DETAIL,
      data: GetExpenseDetailResponseData.of(expense),
    };
  }

  @UseGuards(OwnExpenseGuard)
  @Delete(':id')
  async deleteExpense(@Param('id') id: number) {
    await this.expenseService.deleteExpenseById(id);
    return {
      message: SuccessMessage.EXPENSE_DELETE,
    };
  }
}
