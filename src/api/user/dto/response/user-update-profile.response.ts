import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { User } from '@src/entity/user.entity';

@Exclude()
export class UserUpdateProfileResponse {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  nickname: string;

  static from(user: User) {
    return plainToInstance(UserUpdateProfileResponse, user);
  }
}
