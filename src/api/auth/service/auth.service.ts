import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserCreateInput } from './dto/input/user-create.input';
import { UserVerifyInput } from './dto/input/user-verify.input';
import { User } from '../../../entity/user.entity';
import { ErrorCode } from '../../../shared/enum/error-code.enum';
import { UserVerifyOutput } from './dto/output/user-verify.output';
import { UserCreateOutput } from './dto/output/user-create.output';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * 사용자를 생성한다.
   * @param createUserDto
   * @return 생성된 User 객체
   */
  async createUser(dto: UserCreateInput): Promise<UserCreateOutput> {
    try {
      // NOTE: @BeforeInsert()가 create() 통해서 실행됨
      const userToSave = this.userRepo.create(dto);
      const savedUser = await this.userRepo.save(userToSave);
      return { id: savedUser.id, email: savedUser.email };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(ErrorCode.USER_EMAIL_IS_DUPLICATED);
      }
    }
  }

  /**
   * 이메일과 비밀번호 확인 후 사용자의 일부 정보를 반환한다.
   * @param dto UserVerifyInput
   * @returns UserVerifyOutput
   */
  async verifyUser(dto: UserVerifyInput): Promise<UserVerifyOutput> {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException(ErrorCode.USER_EMAIL_DO_NOT_EXIST);
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(ErrorCode.USER_PASSWORD_IS_WRONG);
    }
    return { id: user.id, email: user.email };
  }
}
