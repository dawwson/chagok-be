import { Controller } from '@nestjs/common';
import { StatService } from '../service/stat.service';

@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}
}
