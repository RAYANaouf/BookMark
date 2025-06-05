import { Module } from '@nestjs/common';
import { TrainingProgramService } from './training-program.service';
import { TrainingProgramController } from './training-program.controller';

@Module({
  providers: [TrainingProgramService],
  controllers: [TrainingProgramController]
})
export class TrainingProgramModule {}
