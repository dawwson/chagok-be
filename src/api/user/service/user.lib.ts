import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@src/entity/user.entity';

@Injectable()
export class UserLib {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  getPendingDeletedUser() {
    return this.userRepo
      .createQueryBuilder('u')
      .withDeleted()
      .where('u.deletedAt IS NOT NULL')
      .andWhere("u.deletedAt <= CURRENT_TIMESTAMP - INTERVAL '7 DAY'")
      .getMany();
  }

  deleteUser(id: string) {
    return this.userRepo.delete(id);
  }
}
