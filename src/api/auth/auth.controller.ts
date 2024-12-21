import { Controller, Post, Body, HttpStatus, HttpCode, Res, Req, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { AuthService } from '@src/api/auth/auth.service';
import { ServerConfig } from '@src/config/server/server.type';
import { SERVER_CONFIG_TOKEN } from '@src/config/server/server.constant';
import { LoggerService } from '@src/logger/logger.service';
import { ApiSuccessResponse } from '@src/shared/decorator/api-success-response.decorator';
import { ApiErrorResponse } from '@src/shared/decorator/api-error-response.decorator';
import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { RequestWithUser } from '@src/shared/interface/request.interface';
import { JwtAuthGuard } from '@src/shared/guard/jwt-auth.guard';

import { UserSignUpRequest } from './dto/request/user-sign-up.request';
import { UserSignUpResponse } from './dto/response/user-sign-up.response';
import { UserSignInRequest } from './dto/request/user-sign-in.request';
import { UserDeleteRequest } from './dto/request/user-delete.request';
import { UserSignInResponse } from './dto/response/user-sign-in.response';

const COOKIE_NAME = 'accessToken';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly cookieExpires: number;

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AuthController.name);
    this.cookieExpires = this.configService.get<ServerConfig>(SERVER_CONFIG_TOKEN).jwtExpiresIn;
  }

  // ✅ 회원가입
  @ApiOperation({ summary: '회원가입', description: '새로운 사용자를 등록합니다.' })
  @ApiSuccessResponse({ status: 201, type: UserSignUpResponse })
  @ApiErrorResponse('POST /auth/sign-up', [
    {
      status: 409,
      description: '이미 사용중인 이메일',
      errorCode: ErrorCode.USER_EMAIL_IS_DUPLICATED,
    },
  ])
  @Post('/sign-up')
  async signUp(@Body() dto: UserSignUpRequest) {
    const createdUser = await this.authService.createUser(await dto.toEntity());
    return UserSignUpResponse.from(createdUser);
  }

  // ✅ 로그인
  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호로 로그인한다. 성공시 `Set-Cookie` 헤더에 `JWT`가 저장됩니다.',
  })
  @ApiSuccessResponse({ status: 200, type: UserSignInResponse })
  @ApiErrorResponse('POST /auth/sign-in', [
    {
      status: 401,
      description: '존재하지 않는 이메일',
      errorCode: ErrorCode.USER_EMAIL_DO_NOT_EXIST,
    },
    {
      status: 401,
      description: '비밀번호 불일치',
      errorCode: ErrorCode.USER_PASSWORD_IS_WRONG,
    },
  ])
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Req() req: Request, @Body() dto: UserSignInRequest, @Res({ passthrough: true }) res: Response) {
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

    this.logger.log('User logged in.', {
      ip: req.ip,
      userId: verifiedUser.id,
    });

    return UserSignInResponse.from(verifiedUser);
  }

  // ✅ 로그아웃
  @ApiOperation({ summary: '로그아웃', description: '`cookie`를 만료시켜 로그아웃 처리합니다.' })
  @ApiHeader({ name: 'Cookie', description: 'accessToken=`JWT`' })
  @ApiResponse({
    status: 204,
    description: '성공',
    headers: {
      'Set-Cookie': {
        schema: { type: 'string', example: 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post('/sign-out')
  signOut(@Req() req: RequestWithUser, @Res() res: Response) {
    res.clearCookie(COOKIE_NAME);

    this.logger.log('User logged out.', {
      ip: req.ip,
      userId: req.user.id,
    });

    return res.status(HttpStatus.NO_CONTENT).send();
  }

  // ✅ 회원탈퇴
  @ApiOperation({ summary: '회원탈퇴', description: '사용자를 임시 삭제하고 `cookie`를 만료시켜 로그아웃 처리합니다.' })
  @ApiHeader({ name: 'Cookie', description: 'accessToken=`JWT`' })
  @ApiResponse({
    status: 204,
    description: '성공',
    headers: {
      'Set-Cookie': {
        schema: { type: 'string', example: 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post('/delete-account')
  async deleteAccount(
    @Req() req: RequestWithUser, //
    @Body() dto: UserDeleteRequest, //
    @Res() res: Response, //
  ) {
    await this.authService.deleteUser({ userId: req.user.id, email: dto.email });

    this.logger.log('User is deleted.', {
      ip: req.ip,
      userId: req.user.id,
      deletionType: 'Soft Delete',
    });

    res.clearCookie(COOKIE_NAME);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
