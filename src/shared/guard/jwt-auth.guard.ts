import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FailMessage } from '../enum/fail-message.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    /**
     * - err : null | Error
     * - user : req.user | false
     */
    if (err || !user) {
      throw err || new UnauthorizedException(FailMessage.AUTH_INVALID_TOKEN);
    }
    return user;
  }
}
