import { IsDefined, IsString } from 'class-validator';
import { ErrorCode } from '@src/shared/enum/error-code.enum';

export class UserUpdatePasswordRequest {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsString({ message: ErrorCode.USER_INVALID_NICKNAME })
  oldPassword: string;

  // TODO: 비밀번호 규칙 추가
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsString({ message: ErrorCode.USER_INVALID_NICKNAME })
  newPassword: string;
}
