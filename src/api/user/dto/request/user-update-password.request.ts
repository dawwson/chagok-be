import { IsDefined, IsString } from 'class-validator';
import { ErrorCode } from '@src/shared/enum/error-code.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdatePasswordRequest {
  @ApiProperty({ description: '이전 비밀번호' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsString({ message: ErrorCode.USER_INVALID_NICKNAME })
  oldPassword: string;

  // TODO: 비밀번호 규칙 추가
  @ApiProperty({ description: '현재 비밀번호' })
  @IsDefined({ message: ErrorCode.MISSING_PARAMETER })
  @IsString({ message: ErrorCode.USER_INVALID_NICKNAME })
  newPassword: string;
}
