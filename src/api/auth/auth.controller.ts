import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { SignUpRequest } from './dto/sign-up-request.dto';
import { SignInRequest } from './dto/sign-in-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() signInRequest: SignUpRequest) {
    return;
  }

  @Post('/sign-in')
  signIn(@Body() signInRequest: SignInRequest) {
    return;
  }
}
