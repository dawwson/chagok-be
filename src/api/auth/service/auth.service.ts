import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../dto/create-user.dto';
import { VerifyUserDto } from '../dto/verify-user.dto';
import { User } from '../../../entity/user.entity';
import { FailMessage } from '../../../shared/enum/fail-message.enum';

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
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // NOTE: @BeforeInsert()가 create() 통해서 실행됨
      const userToSave = this.userRepo.create(createUserDto);
      return await this.userRepo.save(userToSave);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(FailMessage.USER_EMAIL_IS_DUPLICATED);
      }
    }
  }

  /**
   * 이메일과 비밀번호 확인 후 검증된 유저를 반환한다.
   * @param verifyUserDto
   * @return 검증된 User 객체
   */
  async verifyUser(verifyUserDto: VerifyUserDto): Promise<User> {
    const user = await this.userRepo.findOneBy({ email: verifyUserDto.email });
    if (!user) {
      throw new UnauthorizedException(FailMessage.USER_EMAIL_DO_NOT_EXIST);
    }

    const isMatch = await bcrypt.compare(verifyUserDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(FailMessage.USER_PASSWORD_IS_WRONG);
    }
    return user;
  }
}
