import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '@src/entity/user.entity';
import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { ServerConfig } from '@src/shared/interface/config.interface';

interface Payload {
  id: string;
  nickname: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super({
      // cookie 헤더에서 JWT 추출
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req.cookies.accessToken]),
      // Passport에서 JWT 만료 기간을 검증함
      ignoreExpiration: false,
      // secret key
      secretOrKey: configService.get<ServerConfig>('server').jwtSecret,
    });
  }

  async validate(payload: Payload) {
    // NOTE: 여기서부터는 JWT가 유효하다고 가정합니다.
    const user = await this.userRepo.findOneBy({ id: payload.id });
    if (!user) {
      throw new UnauthorizedException(ErrorCode.USER_NOT_FOUND);
    }

    // request의 user에 담아서 전달
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };
  }
}
