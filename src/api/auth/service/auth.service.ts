import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // NOTE: @BeforeInsert()가 create() 통해서 실행됨
      const userToSave = this.userRepo.create(createUserDto);
      return await this.userRepo.save(userToSave);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('이미 존재하는 이메일'); // TODO: 메세지 내용 한 군데로 모으기
      }
    }
  }
}
