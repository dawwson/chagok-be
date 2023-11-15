import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpenseService } from './service/expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return 'POST /expenses';
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return 'PATCH /expenses/:id';
  }

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
