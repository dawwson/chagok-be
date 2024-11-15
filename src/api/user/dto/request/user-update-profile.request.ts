import { IsDefined, IsString, MinLength } from 'class-validator';
import { ErrorCode } from '@src/shared/enum/error-code.enum';

export class UserUpdateProfileRequest {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @MinLength(2, { message: ErrorCode.USER_NICKNAME_OUT_OF_RANGE })
  @IsString({ message: ErrorCode.USER_INVALID_NICKNAME })
  nickname: string;
}
