import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@src/entity/user.entity';
import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { comparePassword, encryptPassword } from '@src/shared/util/encrypt.util';

import { UserUpdateProfileInput } from '../dto/input/user-update-profile.input';
import { UserUpdatePasswordInput } from '../dto/input/user-update-password.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  getUserById(id: string) {
    return this.userRepo.findOneBy({ id });
  }

  async updateUserProfile(dto: UserUpdateProfileInput) {
    const { userId, ...rest } = dto;

    await this.userRepo.update(userId, { ...rest });
  }

  async updateUserPassword(dto: UserUpdatePasswordInput) {
    const { userId, oldPassword, newPassword } = dto;

    const user = await this.userRepo.findOneBy({ id: userId });

    const isMatched = await comparePassword(oldPassword, user.password);
    if (!isMatched) {
      throw new UnauthorizedException(ErrorCode.USER_PASSWORD_IS_WRONG);
    }

    const encryptedPassword = await encryptPassword(newPassword);
    await this.userRepo.update(userId, { password: encryptedPassword });
  }
}
