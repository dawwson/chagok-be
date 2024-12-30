import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

import { User } from '@src/entity/user.entity';

@Exclude()
export class UserSignInResponse {
  @ApiProperty({
    description: '로그인 된 사용자 고유 식별자(UUID)',
    example: '68e6bfa3-64f6-424f-9bcd-afa7ead060ce',
  })
  @Expose()
  id: string;

  @ApiProperty({ description: '로그인 된 사용자 닉네임', example: 'es' })
  @Expose()
  nickname: string;

  static from(user: User) {
    return plainToInstance(UserSignInResponse, user);
  }
}
