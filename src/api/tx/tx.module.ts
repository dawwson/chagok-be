import { Module } from '@nestjs/common';
import { TxService } from './service/tx.service';
import { TxController } from './controller/tx.controller';

@Module({
  controllers: [TxController],
  providers: [TxService],
})
export class TxModule {}
