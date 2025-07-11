import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Param, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, resolve } from 'path';
import * as firebaseAdmin from 'firebase-admin';
import { JwtGuard } from 'src/auth/guard';
import { request } from 'http';
import { getUserIdFromRequest } from 'src/utils/getUserIdFromRequest';

@Controller('course')
export class CourseController {

  constructor(private readonly courseService : CourseService) {}

   
  @Get('all')
  getAllCourses(@Request() req){
    const userId = getUserIdFromRequest(req)
    console.log("start testtt ====>> " , req.headers.authorization)
    console.log("userId ====>> " , userId)
    if(!userId){
      return this.courseService.getAll()
    }else{
      return this.courseService.getAllCourses(userId)
    }
    

  }



  @HttpCode(HttpStatus.CREATED)
  @Post("create")
  @UseInterceptors(
    FileInterceptor("cover",{
      storage : memoryStorage(), //in-memory buffer
      limits : {fileSize: 5 * 1024 * 1024 } //5MB limit
    })
  )
    async create(
      @Body() dto: CreateCourseDto,
      @UploadedFile() file? 
  ) {

    let coverPhotoUrl : string | null = null ;

    if(file){
      const fileName   = 'course_cover/' + uuidv4() + extname(file.originalname)
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

    console.log("create course  ====>> " , dto)
    return this.courseService.create(dto , coverPhotoUrl ?? undefined);
  }

  
  @Get('academy/:academyId')
  async getByAcademy(@Param('academyId') academyId: string) {
    return this.courseService.findByAcademy(Number(academyId));
  }

}
