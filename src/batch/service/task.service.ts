import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { UserLib } from '@src/api/user/service/user.lib';

@Injectable()
export class TaskService {
  // TODO: 로그 파일에 저장
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly userLib: UserLib) {}

  /**
   * 매일 12:00 AM - 탈퇴 처리된 사용자 데이터 일괄 삭제
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteUser() {
    this.logger.log('Account deletion task started.');
    const startTime = Date.now();

    // 탈퇴 대기 사용자 불러오기
    const pendingUsers = await this.userLib.getPendingDeletedUser();
    const deletedUsers = [];

    for (const user of pendingUsers) {
      try {
        await this.userLib.deleteUser(user.id);
        deletedUsers.push(user.id);
      } catch (error) {
        this.logger.error(`Failed to delete user with ID ${user.id}: ${error.message}`, error.stack);
      }
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2); // 단위: 초(소수점 둘째자리까지)

    this.logger.log(
      `Account deletion task completed.
      > Total Users Processed: ${pendingUsers.length},
      > Successfully Deleted: ${deletedUsers.length},
      > Failed: ${pendingUsers.length - deletedUsers.length},
      > Time Taken: ${duration} seconds.
    `,
    );
  }
}
