import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator';

import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { User } from '@src/entity/user.entity';

export class UserSignUpRequest {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsEmail({}, { message: ErrorCode.INVALID_EMAIL })
  email: string;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsString({ message: ErrorCode.INVALID_PASSWORD })
  password: string;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsString({ message: ErrorCode.INVALID_NICKNAME_TYPE })
  @MinLength(2, { message: ErrorCode.INVALID_NICKNAME_LENGTH })
  nickname: string;

  toEntity() {
    return User.create(this.email, this.password, this.nickname);
  }
}
