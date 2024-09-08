import { Controller, Post, Body, HttpStatus, HttpCode, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { AuthService } from '@src/api/auth/service/auth.service';
import { ServerConfig } from '@src/shared/interface/config.interface';

import { UserSignUpRequest } from './dto/request/user-sign-up.request';
import { UserSignInRequest } from './dto/request/user-sign-in.request';
import { UserSignUpResponse } from './dto/response/user-sign-up.response';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/sign-up')
  async signUp(@Body() dto: UserSignUpRequest) {
    const createdUser = await this.authService.createUser(await dto.toEntity());
    return UserSignUpResponse.from(createdUser);
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: UserSignInRequest, @Res() res: Response) {
    const verifyUserDto = dto.toVerifyUserDto();

    // 사용자 검증
    const { id, email } = await this.authService.verifyUser(verifyUserDto);

    // accessToken 발급(JWT)
    const payload = { id, email };
    const accessToken = await this.jwtService.signAsync(payload);

    return res
      .cookie('accessToken', accessToken, {
        // NOTE: XSS 차단
        httpOnly: true,
        // NOTE: JWT랑 만료시간 동일하게 설정(ms 단위여서 1000을 곱한다)
        maxAge: this.configService.get<ServerConfig>('server').jwtExpiresIn * 1000,
      })
      .json({ data: payload });
  }
}
