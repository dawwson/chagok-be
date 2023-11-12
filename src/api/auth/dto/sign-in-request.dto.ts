import { IsEmail, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { VerifyUserDto } from './verify-user.dto';

export class SignInRequest {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  toVerifyUserDto() {
    return plainToInstance(VerifyUserDto, this);
  }
}
