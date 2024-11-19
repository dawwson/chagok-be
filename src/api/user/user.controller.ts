import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@src/shared/guard/jwt-auth.guard';
import { RequestWithUser } from '@src/shared/interface/request.interface';

import { UserShowResponse } from './dto/response/user-show.response';
import { UserUpdateProfileRequest } from './dto/request/user-update-profile.request';
import { UserUpdatePasswordRequest } from './dto/request/user-update-password.request';
import { UserService } from './service/user.service';
import { UserUpdateProfileResponse } from './dto/response/user-update-profile.response';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    const user = await this.userService.getUserById(userId);

    return UserShowResponse.from(user);
  }

  @Patch('profile')
  async updateUserProfile(@Req() req: RequestWithUser, @Body() dto: UserUpdateProfileRequest) {
    const userId = req.user.id;

    await this.userService.updateUserProfile({ userId, ...dto });

    const updatedUser = await this.userService.getUserById(userId);

    return UserUpdateProfileResponse.from(updatedUser);
  }

  @Patch('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUserPassword(@Req() req: RequestWithUser, @Body() dto: UserUpdatePasswordRequest) {
    const userId = req.user.id;
    await this.userService.updateUserPassword({ userId, ...dto });
    return;
  }
}
