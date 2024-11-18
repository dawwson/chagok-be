import { IsDefined, IsEmail } from 'class-validator';
import { ErrorCode } from '@src/shared/enum/error-code.enum';

export class UserDeleteRequest {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsEmail(
    {
      allow_utf8_local_part: false,
    },
    { message: ErrorCode.USER_INVALID_EMAIL },
  )
  email: string;
}
