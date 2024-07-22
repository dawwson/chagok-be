import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '../../../entity/user.entity';
import { IServerConfig } from '../../../shared/interface/server-config.interface';
import { ErrorCode } from '../../../shared/enum/error-code.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super({
      // cookie 헤더에서 JWT 추출
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies.accessToken,
      ]),
      // Passport에서 JWT 만료 기간을 검증함
      ignoreExpiration: false,
      // secret key
      secretOrKey: configService.get<IServerConfig>('server').jwtSecret,
    });
  }

  async validate(payload: { id: string; email: string }) {
    // NOTE: 여기서부터는 JWT가 유효하다고 가정합니다.
    const user = await this.userRepo.findOneBy({ id: payload.id });
    if (!user) {
      throw new UnauthorizedException(ErrorCode.USER_NOT_FOUND);
    }

    // password만 삭제 후 request의 user에 붙여서 전달
    delete user.password;
    return user;
  }
}
