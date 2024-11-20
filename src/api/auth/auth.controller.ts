import { Controller, Post, Body, HttpStatus, HttpCode, Res, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { AuthService } from '@src/api/auth/auth.service';
import { ServerConfig } from '@src/shared/interface/config.interface';
import { RequestWithUser } from '@src/shared/interface/request.interface';
import { JwtAuthGuard } from '@src/shared/guard/jwt-auth.guard';

import { UserSignUpRequest } from './dto/request/user-sign-up.request';
import { UserSignUpResponse } from './dto/response/user-sign-up.response';
import { UserSignInRequest } from './dto/request/user-sign-in.request';
import { UserDeleteRequest } from './dto/request/user-delete.request';
import { UserSignInResponse } from './dto/response/user-sign-in.response';

const COOKIE_NAME = 'accessToken';

@Controller('auth')
export class AuthController {
  private readonly cookieExpires: number;

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.cookieExpires = this.configService.get<ServerConfig>('server').jwtExpiresIn;
  }

  // 회원가입
  @Post('/sign-up')
  async signUp(@Body() dto: UserSignUpRequest) {
    const createdUser = await this.authService.createUser(await dto.toEntity());
    return UserSignUpResponse.from(createdUser);
  }

  // 로그인
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: UserSignInRequest, @Res({ passthrough: true }) res: Response) {
    const verifiedUser = await this.authService.verifyUser(dto.toVerifyUserDto());

    // accessToken 발급(JWT)
    const accessToken = await this.jwtService.signAsync({
      id: verifiedUser.id,
      nickname: verifiedUser.nickname,
    });

    res.cookie(COOKIE_NAME, accessToken, {
      // XSS 차단
      httpOnly: true,
      // JWT랑 만료시간 동일하게 설정(단위: 밀리초 -> 1000을 곱한다)
      maxAge: this.cookieExpires * 1000,
      // 서드파티 쿠키로 허용
      sameSite: 'none',
      // HTTPS에서만 쿠키 전송
      secure: true,
    });

    return UserSignInResponse.from(verifiedUser);
  }

  // 로그아웃
  @UseGuards(JwtAuthGuard)
  @Post('/sign-out')
  signOut(@Res() res: Response) {
    res.clearCookie(COOKIE_NAME);
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  // 회원탈퇴
  @UseGuards(JwtAuthGuard)
  @Post('/delete-account')
  async deleteAccount(
    @Req() req: RequestWithUser, //
    @Body() dto: UserDeleteRequest, //
    @Res() res: Response, //
  ) {
    await this.authService.deleteUser({ userId: req.user.id, email: dto.email });

    res.clearCookie(COOKIE_NAME);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
