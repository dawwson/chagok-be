import { IsDefined, IsEmail, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UserVerifyInput } from '../../../service/dto/input/user-verify.input';
import { ErrorCode } from '../../../../../shared/enum/error-code.enum';

export class UserSignInRequest {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsEmail({}, { message: ErrorCode.INVALID_EMAIL })
  email: string;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsString({ message: ErrorCode.INVALID_PASSWORD })
  password: string;

  toVerifyUserDto() {
    return plainToInstance(UserVerifyInput, this);
  }
}
