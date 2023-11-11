import { IsEmail, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class SignUpRequest {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  toCreateUserDto(): CreateUserDto {
    return plainToInstance(CreateUserDto, this);
  }
}
