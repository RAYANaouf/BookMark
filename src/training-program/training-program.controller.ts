import { Body, Controller, Post } from '@nestjs/common';
import { TrainingProgramService } from './training-program.service';
import { CreateTrainingProgramDto } from './dto';

@Controller('training-program')
export class TrainingProgramController {

    constructor(private readonly trainingProgramService: TrainingProgramService) {}

    @Post()
    async create(@Body() dto: CreateTrainingProgramDto) {
      return this.trainingProgramService.create(dto);
    }

}
