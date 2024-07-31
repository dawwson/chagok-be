import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateExpenseResource } from './update-expense-resource.dto';
import { ErrorCode } from '../../../shared/enum/error-code.enum';

export class UpdateExpenseRequestBody {
  @IsNumber({}, { message: ErrorCode.INVALID_CATEGORY_ID })
  @IsOptional()
  categoryId?: number;

  @IsString({ message: ErrorCode.INVALID_CONTENT })
  @MaxLength(100, { message: ErrorCode.OUT_OF_RANGE })
  @IsOptional()
  content?: string;

  @IsNumber({}, { message: ErrorCode.INVALID_AMOUNT })
  @Min(10, { message: ErrorCode.OUT_OF_RANGE }) // 10원 이상
  @Max(2000000000, { message: ErrorCode.OUT_OF_RANGE }) // 20억 이하
  @IsOptional()
  amount?: number;

  @Type(() => Date)
  @IsDate({ message: ErrorCode.INVALID_DATE }) // YYYY-MM-DD
  @IsOptional()
  expenseDate?: Date;

  @IsBoolean({ message: ErrorCode.INVALID_IS_EXCLUDED })
  @IsOptional()
  isExcluded?: boolean;

  // TODO: Mapper 클래스로 만들어보기
  toUpdateExpenseResource() {
    const updateExpenseResource = new UpdateExpenseResource();

    if (this.categoryId) {
      updateExpenseResource.categoryId = this.categoryId;
    }
    if (this.content !== undefined) {
      // ''(빈 문자열)로 받아도 변경 가능
      updateExpenseResource.content = this.content;
    }
    if (this.amount) {
      updateExpenseResource.amount = this.amount;
    }
    if (this.expenseDate) {
      updateExpenseResource.expenseDate = this.expenseDate;
    }
    if (this.isExcluded !== undefined) {
      // true 또는 false로 값이 오면 변경 가능
      updateExpenseResource.isExcluded = this.isExcluded;
    }

    return updateExpenseResource;
  }
}
