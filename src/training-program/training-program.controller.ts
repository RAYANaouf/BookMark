import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TrainingProgramService } from './training-program.service';
import { CreateTrainingProgramDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, resolve } from 'path';
import * as firebaseAdmin from 'firebase-admin';

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

    let coverPhotoUrl : string | null = null ;

    if(file){
      const fileName   = 'training_program_cover/' + uuidv4() + extname(file.originalname)
      const bucket     = firebaseAdmin.storage().bucket()
      const fileUpload = bucket.file(fileName)

      const stream = fileUpload.createWriteStream({
        metadata : {
          contentType : file.mimetype
        }
      });

      await new Promise((resolve,reject)=>{
        stream.on("error" , (error)=>{
          console.error("❌ Error uploading file:", error)
          reject(error)
        })

        stream.on("finish" , async () => {
          console.log("✅ File uploaded successfully")
          await fileUpload.makePublic();
          coverPhotoUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
          resolve(null)
        })

        stream.end(file.buffer)
      })
    }

    console.log("create training program ====>> " , dto)
    return this.trainingProgramService.create(dto , coverPhotoUrl ?? undefined);
  }

  
  @Get('academy/:academyId')
  async getByAcademy(@Param('academyId') academyId: string) {
    return this.trainingProgramService.findByAcademy(Number(academyId));
  }

}
