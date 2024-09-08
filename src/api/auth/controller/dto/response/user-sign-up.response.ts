import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { User } from 'src/entity/user.entity';

@Exclude()
export class UserSignUpResponse {
  @Expose()
  id: string;

  @Expose()
  email: string;

  static from(user: User) {
    return plainToInstance(UserSignUpResponse, user);
  }
}
