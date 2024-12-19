import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

import { User } from '@src/entity/user.entity';

@Exclude()
export class UserUpdateProfileResponse {
  @ApiProperty({
    description: '사용자 고유 식별자(uuid)',
    example: '68e6bfa3-64f6-424f-9bcd-afa7ead060ce',
  })
  @Expose()
  id: string;

  @ApiProperty({ description: '사용자 이메일', example: 'test@email.com' })
  @Expose()
  email: string;

  @ApiProperty({ description: '수정된 사용자 닉네임', example: 'es', minimum: 2 })
  @Expose()
  nickname: string;

  static from(user: User) {
    return plainToInstance(UserUpdateProfileResponse, user);
  }
}
