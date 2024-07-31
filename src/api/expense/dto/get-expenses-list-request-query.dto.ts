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
import { GetExpensesCondition } from './get-expenses-condition.dto';
import { GetCategoriesWithTotalAmountCondition } from './get-categories-with-total-amount-condition.dto';
import { ErrorCode } from '../../../shared/enum/error-code.enum';

export class GetExpensesListRequestQuery {
  @Type(() => Date)
  @IsDate({ message: ErrorCode.MISSING_PARAMETER })
  startDate: Date;

  @Type(() => Date)
  @IsDate({ message: ErrorCode.MISSING_PARAMETER })
  endDate: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: ErrorCode.INVALID_CATEGORY_ID })
  categoryId?: number;

  @ValidateIf((o) => o.maxAmount !== undefined)
  @IsDefined({ message: () => ErrorCode.EXPENSE_MIN_MAX_AMOUNT_EXCLUSIVE })
  @Type(() => Number)
  @IsNumber()
  @Min(1000)
  @IsSmallerThan('maxAmount', {
    message: ErrorCode.EXPENSE_MIN_AMOUNT_MORE_THAN_MAX,
  })
  minAmount?: number;

  @ValidateIf((o) => o.minAmount !== undefined)
  @IsDefined({ message: () => ErrorCode.EXPENSE_MIN_MAX_AMOUNT_EXCLUSIVE })
  @Type(() => Number)
  @IsNumber()
  maxAmount?: number;

  toGetExpensesCondition(userId: string): GetExpensesCondition {
    const getExpensesCondition = new GetExpensesCondition();
    getExpensesCondition.userId = userId;
    getExpensesCondition.startDate = this.startDate;
    getExpensesCondition.endDate = this.endDate;
    getExpensesCondition.categoryId = this.categoryId;
    getExpensesCondition.maxAmount = this.maxAmount;
    getExpensesCondition.minAmount = this.minAmount;

    return getExpensesCondition;
  }

  toGetCategoriesWithTotalAmountCondition(
    userId: string,
  ): GetCategoriesWithTotalAmountCondition {
    const getCategoriesWithTotalAmountCondition =
      new GetCategoriesWithTotalAmountCondition();
    getCategoriesWithTotalAmountCondition.userId = userId;
    getCategoriesWithTotalAmountCondition.startDate = this.startDate;
    getCategoriesWithTotalAmountCondition.endDate = this.endDate;

    if (this.minAmount && this.maxAmount) {
      getCategoriesWithTotalAmountCondition.maxAmount = this.maxAmount;
      getCategoriesWithTotalAmountCondition.minAmount = this.minAmount;
    }
    return getCategoriesWithTotalAmountCondition;
  }
}

export function IsSmallerThan(
  property: string,
  validationOptions?: ValidationOptions,
) {
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
          return (
            typeof value === 'number' &&
            typeof relatedValue === 'number' &&
            value < relatedValue
          );
        },
      },
    });
  };
}
