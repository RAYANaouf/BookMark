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



  @HttpCode(HttpStatus.CREATED)
  @Post("create")
  @ApiOperation({ 
    summary: 'Create a new course',
    description: 'Creates a new course with the provided details. Supports optional cover photo upload.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Course data and optional cover photo',
    schema: {
      type: 'object',
      required: ['academyId', 'moduleId', 'name', 'description'],
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
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'order'],
            properties: {
              name: {
                type: 'string',
                example: 'Introduction to Advanced Concepts'
              },
              description: {
                type: 'string',
                example: 'Overview of what we\'ll cover'
              },
              order: {
                type: 'number',
                example: 1
              }
            }
          },
          description: 'List of chapters for the course'
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The course has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Advanced Web Development' },
        description: { type: 'string', example: 'Learn advanced web development concepts' },
        coverPhoto: { 
          type: 'string', 
          example: 'https://storage.googleapis.com/...',
          nullable: true 
        },
        chapters: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Introduction' },
              description: { type: 'string', example: 'Course introduction', nullable: true },
              order: { type: 'number', example: 1 },
              isPublished: { type: 'boolean', example: false },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        academy: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Tech Academy' }
          }
        },
        module: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Web Development' }
          }
        }
      }
    }
  })
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

    console.log("create course  ====>> " , dto)

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
