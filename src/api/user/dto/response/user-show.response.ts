import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { User } from '@src/entity/user.entity';

@Exclude()
export class UserShowResponse {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  nickname: string;

  static from(user: User) {
    return plainToInstance(UserShowResponse, user);
  }
}
