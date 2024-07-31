import { IsDefined, IsEmail, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { ErrorCode } from '../../../shared/enum/error-code.enum';

export class SignUpRequest {
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsEmail({}, { message: ErrorCode.INVALID_EMAIL })
  email: string;

  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsString({ message: ErrorCode.INVALID_PASSWORD })
  password: string;

  toCreateUserDto(): CreateUserDto {
    return plainToInstance(CreateUserDto, this);
  }
}
