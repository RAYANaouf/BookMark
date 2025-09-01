import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Param, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import * as firebaseAdmin from 'firebase-admin';
import { JwtGuard } from 'src/auth/guard';
import { request } from 'http';
import { getUserIdFromRequest } from 'src/utils/getUserIdFromRequest';
import { BadRequestException } from '@nestjs/common';

@ApiTags('courses')
@Controller('course')
export class CourseController {

  constructor(private readonly courseService : CourseService) {}

   
  @Get('all')
  getAllCourses(@Request() req){
    const userId = getUserIdFromRequest(req)
    if(!userId){
      return this.courseService.getAll()
    }else{
      return this.courseService.getAllCourses(userId)
    }
  }



  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new course',
    description: 'Creates a new course with the provided details. Supports both JSON and form-data formats.'
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiBody({
    description: 'Course data and optional cover photo',
    schema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            cover: {
              type: 'string',
              format: 'binary',
              description: 'Course cover photo (optional, max 5MB)'
            },
            academyId: { 
              type: 'number',
              example: 1,
              description: 'ID of the academy this course belongs to'
            },
            moduleId: {
              type: 'number',
              example: 1,
              description: 'ID of the module this course belongs to'
            },
            name: {
              type: 'string',
              example: 'Advanced Web Development',
              description: 'Name of the course'
            },
            description: {
              type: 'string',
              example: 'Learn advanced web development concepts and best practices',
              description: 'Detailed description of the course'
            },
            targetAudience: {
              type: 'string',
              example: 'Intermediate web developers',
              description: 'Intended audience for this course',
            },
            prerequisites: {
              type: 'string',
              example: 'Basic knowledge of HTML, CSS, and JavaScript',
              description: 'Prerequisites for taking this course',
            },
            whatYouWillLearn: {
              type: 'string',
              example: 'Advanced React patterns, Performance optimization, State management',
              description: 'Key learning outcomes',
            },
            whatYouCanDoAfter: {
              type: 'string',
              example: 'Build complex web applications, Optimize performance, Implement best practices',
              description: 'Skills gained after completing the course',
            },
            minAge: {
              type: 'number',
              example: 16,
              description: 'Minimum age requirement',
            },
            maxAge: {
              type: 'number',
              example: 99,
              description: 'Maximum age limit',
            },
            price: {
              type: 'number',
              example: 99.99,
              description: 'Course price',
            },
            chapters: {
              type: 'string',
              description: 'JSON string of chapters array',
              example: JSON.stringify([{
                name: 'Introduction',
                description: 'Course overview',
                order: 1
              }])
            }
          }
        },
        {
          type: 'object',
          properties: {
            academyId: { type: 'number' },
            moduleId: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            targetAudience: { type: 'string' },
            prerequisites: { type: 'string' },
            whatYouWillLearn: { type: 'string' },
            whatYouCanDoAfter: { type: 'string' },
            minAge: { type: 'number' },
            maxAge: { type: 'number' },
            price: { type: 'number' },
            chapters: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  order: { type: 'number' }
                }
              }
            }
          }
        }
      ]
    }
  })
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
    })
  )
  async create(
    @Body() dto: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    let courseData = dto;
    
    if (typeof dto.chapters === 'string') {
      try {
        courseData = {
          ...dto,
          chapters: JSON.parse(dto.chapters)
        };
      } catch (e) {
        throw new BadRequestException('Invalid chapters format. Must be a valid JSON string');
      }
    }

    if (courseData.academyId) courseData.academyId = +courseData.academyId;
    if (courseData.moduleId) courseData.moduleId = +courseData.moduleId;
    if (courseData.price) courseData.price = +courseData.price;
    if (courseData.minAge) courseData.minAge = +courseData.minAge;
    if (courseData.maxAge) courseData.maxAge = +courseData.maxAge;

    console.log('create course ====>>', courseData);

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

    console.log("create course  ====>> " , courseData)
    return this.courseService.create(courseData , coverPhotoUrl ?? undefined);
  }

  
  @Get('academy/:academyId')
  async getByAcademy(@Param('academyId') academyId: string) {
    return this.courseService.findByAcademy(Number(academyId));
  }

}
