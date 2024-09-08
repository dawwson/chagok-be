import {
  IsDate,
  IsDefined,
  IsNumber,
  IsOptional,
  Min,
  registerDecorator,
  ValidateIf,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ErrorCode } from '@src/shared/enum/error-code.enum';

export class ExpenseShowRequest {
  @Type(() => Date)
  @IsDate({ message: ErrorCode.MISSING_PARAMETER })
  readonly startDate: Date;

  @Type(() => Date)
  @IsDate({ message: ErrorCode.MISSING_PARAMETER })
  readonly endDate: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: ErrorCode.INVALID_CATEGORY_ID })
  readonly categoryId?: number;

  @ValidateIf((o) => o.maxAmount !== undefined)
  @IsDefined({ message: () => ErrorCode.EXPENSE_MIN_MAX_AMOUNT_EXCLUSIVE })
  @Type(() => Number)
  @IsNumber()
  @Min(1000)
  @IsSmallerThan('maxAmount', {
    message: ErrorCode.EXPENSE_MIN_AMOUNT_MORE_THAN_MAX,
  })
  readonly minAmount?: number;

  @ValidateIf((o) => o.minAmount !== undefined)
  @IsDefined({ message: () => ErrorCode.EXPENSE_MIN_MAX_AMOUNT_EXCLUSIVE })
  @Type(() => Number)
  @IsNumber()
  readonly maxAmount?: number;

  // toExpenseFindInput(userId: string): ExpenseFindInput {
  //   const getExpensesCondition = new ExpenseFindInput();
  //   getExpensesCondition.userId = userId;
  //   getExpensesCondition.startDate = this.startDate;
  //   getExpensesCondition.endDate = this.endDate;
  //   getExpensesCondition.categoryId = this.categoryId;
  //   getExpensesCondition.maxAmount = this.maxAmount;
  //   getExpensesCondition.minAmount = this.minAmount;

  //   return getExpensesCondition;
  // }

  // toExpenseFindByCategoryInput(userId: string): ExpenseFindByCategoryInput {
  //   const getCategoriesWithTotalAmountCondition = new ExpenseFindByCategoryInput();
  //   getCategoriesWithTotalAmountCondition.userId = userId;
  //   getCategoriesWithTotalAmountCondition.startDate = this.startDate;
  //   getCategoriesWithTotalAmountCondition.endDate = this.endDate;

  //   if (this.minAmount && this.maxAmount) {
  //     getCategoriesWithTotalAmountCondition.maxAmount = this.maxAmount;
  //     getCategoriesWithTotalAmountCondition.minAmount = this.minAmount;
  //   }
  //   return getCategoriesWithTotalAmountCondition;
  // }
}

function IsSmallerThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isSmallerThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return typeof value === 'number' && typeof relatedValue === 'number' && value < relatedValue;
        },
      },
    });
  };
}
