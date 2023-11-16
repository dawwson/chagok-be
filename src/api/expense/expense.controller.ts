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
// import { UpdateExpenseDto } from './dto/update-expense.dto';

import { ExpenseService } from './service/expense.service';

import { JwtAuthGuard } from '../../shared/guard/jwt-auth.guard';
import { RequestWithUser } from '../../shared/interface/request-with-user.interfact';
import { SuccessMessage } from '../../shared/enum/success-message.enum';
import { CreateExpenseResponseData } from './dto/create-expense-response-data.dto';

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

  // @Patch(':id')
  // update(@Param('id') id: number, @Body() updateExpenseDto: UpdateExpenseDto) {
  //   return 'PATCH /expenses/:id';
  // }

  @Get()
  findAll() {
    return 'GET /expenses';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return 'GET /expenses/:id';
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return 'DELETE /expenses/:id';
  }
}
