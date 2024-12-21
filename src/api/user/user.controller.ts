import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation } from '@nestjs/swagger';

import { LoggerService } from '@src/logger/logger.service';
import { JwtAuthGuard } from '@src/shared/guard/jwt-auth.guard';
import { RequestWithUser } from '@src/shared/interface/request.interface';

import { UserShowResponse } from './dto/response/user-show.response';
import { UserUpdateProfileRequest } from './dto/request/user-update-profile.request';
import { UserUpdateProfileResponse } from './dto/response/user-update-profile.response';
import { UserUpdatePasswordRequest } from './dto/request/user-update-password.request';
import { UserService } from './service/user.service';
import { ApiSuccessResponse } from '@src/shared/decorator/api-success-response.decorator';
import { ApiErrorResponse } from '@src/shared/decorator/api-error-response.decorator';
import { ErrorCode } from '@src/shared/enum/error-code.enum';

@ApiHeader({ name: 'Cookie', description: 'accessToken=`JWT`' })
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(UserController.name);
  }

  // ✅ 사용자 조회
  @ApiOperation({ summary: '사용자 조회', description: '요청을 보낸 사용자의 정보를 조회한다.' })
  @ApiSuccessResponse({ status: 200, type: UserShowResponse })
  @Get()
  async getUser(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    const user = await this.userService.getUserById(userId);

    return UserShowResponse.from(user);
  }

  // ✅ 사용자 프로필 수정
  @ApiOperation({ summary: '사용자 프로필 수정', description: '요청을 보낸 사용자의 프로필 정보를 수정한다.' })
  @ApiSuccessResponse({ status: 200, type: UserUpdateProfileResponse })
  @Patch('profile')
  async updateUserProfile(@Req() req: RequestWithUser, @Body() dto: UserUpdateProfileRequest) {
    const userId = req.user.id;

    await this.userService.updateUserProfile({ userId, ...dto });

    const updatedUser = await this.userService.getUserById(userId);

    this.logger.log('User updated profile.', {
      ip: req.ip,
      userId: userId,
      before: req.user.nickname,
      after: dto.nickname,
    });

    return UserUpdateProfileResponse.from(updatedUser);
  }

  // ✅ 사용자 비밀번호 수정
  @ApiOperation({ summary: '사용자 비밀번호 수정', description: '요청을 보낸 사용자의 비밀번호를 수정한다.' })
  @ApiSuccessResponse({ status: 204 })
  @ApiErrorResponse('PATCH /users/password', [
    {
      status: 401,
      description: '비밀번호 불일치',
      errorCode: ErrorCode.USER_PASSWORD_IS_WRONG,
    },
  ])
  @Patch('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUserPassword(@Req() req: RequestWithUser, @Body() dto: UserUpdatePasswordRequest) {
    const userId = req.user.id;

    await this.userService.updateUserPassword({ userId, ...dto });

    this.logger.log('User updated password', {
      ip: req.ip,
      userId: userId,
    });

    return;
  }
}
