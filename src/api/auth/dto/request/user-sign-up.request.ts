import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator';

import { User } from '@src/entity/user.entity';
import { ErrorCode } from '@src/shared/enum/error-code.enum';

export class UserSignUpRequest {
  @ApiProperty({ description: '이메일' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsEmail(
    {
      allow_utf8_local_part: false, // 영어만 허용
    },
    { message: ErrorCode.USER_INVALID_EMAIL },
  )
  email: string;

  // TODO: 비밀번호 규칙 추가
  @ApiProperty({ description: '비밀번호' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsString({ message: ErrorCode.USER_INVALID_PASSWORD })
  password: string;

  @ApiProperty({ description: '닉네임 (2자 이상)' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @MinLength(2, { message: ErrorCode.USER_NICKNAME_OUT_OF_RANGE })
  @IsString({ message: ErrorCode.USER_INVALID_NICKNAME })
  nickname: string;

  toEntity() {
    return User.create(this.email, this.password, this.nickname);
  }
}
