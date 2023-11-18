import {
  IsDate,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CreateExpenseResource } from './create-expense-resource.dto';
import { Type } from 'class-transformer';

export class CreateExpenseRequestBody {
  @IsNumber()
  categoryId: number;

  @IsString()
  @MaxLength(100)
  content: string;

  @IsNumber()
  @Min(10) // 10원 이상
  @Max(2000000000) // 20억 이하
  amount: number;

  @Type(() => Date)
  @IsDate()
  expenseDate: Date;

  // TODO: Mapper 클래스로 만들어보기
  toCreateExpenseResource(userId: string) {
    const createExpenseResource = new CreateExpenseResource();

    createExpenseResource.userId = userId;
    createExpenseResource.categoryId = this.categoryId;
    createExpenseResource.content = this.content;
    createExpenseResource.amount = this.amount;
    createExpenseResource.expenseDate = this.expenseDate;

    return createExpenseResource;
  }
}
