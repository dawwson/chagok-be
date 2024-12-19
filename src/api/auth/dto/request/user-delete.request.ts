import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail } from 'class-validator';

import { ErrorCode } from '@src/shared/enum/error-code.enum';

export class UserDeleteRequest {
  @ApiProperty({ description: '이메일' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsEmail(
    {
      allow_utf8_local_part: false,
    },
    { message: ErrorCode.USER_INVALID_EMAIL },
  )
  email: string;
}
