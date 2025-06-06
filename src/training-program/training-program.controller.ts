import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TrainingProgramService } from './training-program.service';
import { CreateTrainingProgramDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('training-program')
export class TrainingProgramController {

    constructor(private readonly trainingProgramService: TrainingProgramService) {}

    
    @HttpCode(HttpStatus.CREATED)
    @Post("create")
    @UseInterceptors(
      FileInterceptor("cover",{
        storage : memoryStorage(), //in-memory buffer
        limits : {fileSize: 5 * 1024 * 1024 } //5MB limit
      })
    )
    async create(
      @Body() dto: CreateTrainingProgramDto,
      @UploadedFile() file? 
  ) {
      console.log("create training program ====>> " , dto)
      return this.trainingProgramService.create(dto);
  }

  

}
