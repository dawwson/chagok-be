import { Module } from '@nestjs/common';
import { StatService } from './service/stat.service';
import { StatController } from './controller/stat.controller';

@Module({
  controllers: [StatController],
  providers: [StatService],
})
export class StatModule {}
