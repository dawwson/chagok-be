import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator';

import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { User } from '@src/entity/user.entity';

export class UserSignUpRequest {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsEmail(
    {
      allow_utf8_local_part: false,
    },
    { message: ErrorCode.USER_INVALID_EMAIL },
  )
  email: string;

  // TODO: 비밀번호 규칙 추가
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsString({ message: ErrorCode.USER_INVALID_PASSWORD })
  password: string;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @MinLength(2, { message: ErrorCode.USER_NICKNAME_OUT_OF_RANGE })
  @IsString({ message: ErrorCode.USER_INVALID_NICKNAME })
  nickname: string;

  toEntity() {
    return User.create(this.email, this.password, this.nickname);
  }
}
