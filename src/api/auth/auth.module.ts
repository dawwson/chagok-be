import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './service/auth.service';
import { AuthController } from './auth.controller';

import { User } from '../../entity/user.entity';
import { IServerConfig } from '../../shared/interface/server-config.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<IServerConfig>('server').jwtSecret,
          signOptions: {
            expiresIn: configService.get<IServerConfig>('server').jwtExpiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
