// import { Transform } from 'class-transformer';
// import { IsDefined, IsIn, IsNumber, IsNumberString, IsPositive, Length } from 'class-validator';

// import { BudgetMonth } from '@src/shared/enum/budget-month.enum';
// import { ErrorCode } from '@src/shared/enum/error-code.enum';

// export class BudgetRecommendRequestParam {
//   @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
//   @IsNumberString({}, { message: ErrorCode.INVALID_YEAR })
//   @Length(4, 4, { message: ErrorCode.INVALID_YEAR })
//   year: string;

//   @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
//   @IsIn([...Object.values(BudgetMonth)], { message: ErrorCode.INVALID_MONTH })
//   month: BudgetMonth;
// }

// export class BudgetRecommendRequestQuery {
//   @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
//   @Transform(({ value }) => parseInt(value))
//   @IsNumber({}, { message: ErrorCode.INVALID_TOTAL_AMOUNT })
//   @IsPositive({ message: ErrorCode.INVALID_TOTAL_AMOUNT })
//   totalAmount: number;
// }
