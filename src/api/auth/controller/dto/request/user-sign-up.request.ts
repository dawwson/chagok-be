import { IsDefined, IsEmail, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UserCreateInput } from '../../../service/dto/input/user-create.input';
import { ErrorCode } from '../../../../../shared/enum/error-code.enum';

export class UserSignUpRequest {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsEmail({}, { message: ErrorCode.INVALID_EMAIL })
  email: string;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsString({ message: ErrorCode.INVALID_PASSWORD })
  password: string;

  toCreateUserDto(): UserCreateInput {
    return plainToInstance(UserCreateInput, this);
  }
}
