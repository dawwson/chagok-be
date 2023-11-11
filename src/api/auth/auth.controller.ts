import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { SignUpRequest } from './dto/sign-up-request.dto';
import { SignInRequest } from './dto/sign-in-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body() signUpRequest: SignUpRequest) {
    const createUserDto = signUpRequest.toCreateUserDto();
    const savedUser = await this.authService.createUser(createUserDto);

    return {
      message: '회원 가입 성공', // TODO: 메세지 내용 한 군데로 모으기
      data: {
        id: savedUser.id,
        email: savedUser.email,
      },
    };
  }

  @Post('/sign-in')
  signIn(@Body() signInRequest: SignInRequest) {
    return;
  }
}
