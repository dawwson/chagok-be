import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { IServerConfig } from '../../shared/interface/server-config.interface';

import { SignUpRequest } from './dto/sign-up-request.dto';
import { SignInRequest } from './dto/sign-in-request.dto';
import { AuthService } from './service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/sign-up')
  async signUp(@Body() signUpRequest: SignUpRequest) {
    const createUserDto = signUpRequest.toCreateUserDto();
    const savedUser = await this.authService.createUser(createUserDto);

    return {
      id: savedUser.id,
      email: savedUser.email,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/sign-in')
  async signIn(@Body() signInRequest: SignInRequest, @Res() res: Response) {
    const verifyUserDto = signInRequest.toVerifyUserDto();

    // 사용자 검증
    const verifiedUser = await this.authService.verifyUser(verifyUserDto);

    // accessToken 발급(JWT)
    const payload = { id: verifiedUser.id, email: verifiedUser.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return res
      .cookie('accessToken', accessToken, {
        // NOTE: XSS 차단
        httpOnly: true,
        // NOTE: JWT랑 만료시간 동일하게 설정(ms 단위여서 1000을 곱한다)
        maxAge:
          this.configService.get<IServerConfig>('server').jwtExpiresIn * 1000,
      })
      .json({ data: payload });
  }
}
