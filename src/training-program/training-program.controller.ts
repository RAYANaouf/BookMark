import { Body, Controller, Post } from '@nestjs/common';
import { TrainingProgramService } from './training-program.service';
import { CreateTrainingProgramDto } from './dto';

@Controller('training-program')
export class TrainingProgramController {

    constructor(private readonly trainingProgramService: TrainingProgramService) {}

    @Post("create")
    async create(@Body() dto: CreateTrainingProgramDto) {
      console.log("create training program ====>> " , dto)
      return this.trainingProgramService.create(dto);
    }

}
