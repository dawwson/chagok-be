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

export class UpdateExpenseRequestBody {
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  content?: string;

  @IsNumber()
  @Min(10) // 10원 이상
  @Max(2000000000) // 20억 이하
  @IsOptional()
  amount?: number;

  @Type(() => Date)
  @IsDate() // YYYY-MM-DD
  @IsOptional()
  expenseDate?: Date;

  @IsBoolean()
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
