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
} from '@nestjs/common';

import { CreateExpenseRequestBody } from './dto/create-expense-request-body.dto';
import { CreateExpenseResponseData } from './dto/create-expense-response-data.dto';
import { UpdateExpenseResponseData } from './dto/update-expense-response-body.dto';
import { UpdateExpenseRequestBody } from './dto/update-expense-request-body.dto';

import { ExpenseService } from './service/expense.service';

import { SuccessMessage } from '../../shared/enum/success-message.enum';
import { RequestWithUser } from '../../shared/interface/request-with-user.interfact';
import { JwtAuthGuard } from '../../shared/guard/jwt-auth.guard';
import { OwnExpenseGuard } from './guard/own-expense.guard';

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
  findAll() {
    return 'GET /expenses';
  }

  @UseGuards(OwnExpenseGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return 'GET /expenses/:id';
  }

  @UseGuards(OwnExpenseGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return 'DELETE /expenses/:id';
  }
}
