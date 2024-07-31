import {
  IsDate,
  IsDefined,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CreateExpenseResource } from './create-expense-resource.dto';
import { Type } from 'class-transformer';
import { ErrorCode } from 'src/shared/enum/error-code.enum';

export class CreateExpenseRequestBody {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.INVALID_CATEGORY_ID })
  categoryId: number;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsString({ message: ErrorCode.INVALID_CONTENT })
  @MaxLength(100, { message: ErrorCode.OUT_OF_RANGE })
  content: string;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsNumber({}, { message: ErrorCode.INVALID_AMOUNT })
  @Min(10, { message: ErrorCode.OUT_OF_RANGE }) // 10원 이상
  @Max(2000000000, { message: ErrorCode.OUT_OF_RANGE }) // 20억 이하
  amount: number;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @Type(() => Date)
  @IsDate({ message: ErrorCode.INVALID_DATE }) // YYYY-MM-DD
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
