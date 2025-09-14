import { Module } from '@nestjs/common';
import { SeanceController } from './seance.controller';
import { SeanceService } from './seance.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SeanceController],
  providers: [SeanceService],
  exports: [SeanceService],
})
export class SeanceModule {}
