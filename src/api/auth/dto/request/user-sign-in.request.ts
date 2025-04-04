import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { UserVerifyInput } from '@src/api/auth/dto/input/user-verify.input';
import { ErrorCode } from '@src/shared/enum/error-code.enum';

export class UserSignInRequest {
  @ApiProperty({ description: '이메일' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsEmail({}, { message: ErrorCode.USER_INVALID_EMAIL })
  email: string;

  @ApiProperty({ description: '비밀번호' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsString({ message: ErrorCode.USER_INVALID_PASSWORD })
  password: string;

  toVerifyUserDto() {
    return plainToInstance(UserVerifyInput, this);
  }
}
