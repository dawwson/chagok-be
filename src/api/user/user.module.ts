import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@src/entity/user.entity';

import { UserController } from './user.controller';
import { UserLib } from './service/user.lib';
import { UserService } from './service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserLib],
  controllers: [UserController],
  exports: [UserLib],
})
export class UserModule {}
