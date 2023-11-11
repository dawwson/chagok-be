import { IsEmail, IsString } from 'class-validator';

export class SignUpRequest {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
