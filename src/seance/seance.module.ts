import { Module } from '@nestjs/common';
import { SeanceController } from './seance.controller';
import { SeanceService } from './seance.service';

@Module({
  controllers: [SeanceController],
  providers: [SeanceService]
})
export class SeanceModule {}
