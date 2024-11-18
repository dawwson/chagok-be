import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@src/entity/user.entity';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserLib } from './service/user.lib';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserLib],
  controllers: [UserController],
  exports: [UserLib],
})
export class UserModule {}
