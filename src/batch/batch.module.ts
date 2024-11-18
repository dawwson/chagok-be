import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './service/task.service';
import { UserModule } from '@src/api/user/user.module';

@Module({
  imports: [ScheduleModule.forRoot(), UserModule],
  providers: [TaskService],
})
export class BatchModule {}
