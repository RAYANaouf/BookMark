import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Param, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
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
import { ParseIntPipe } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Delete } from '@nestjs/common';

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
    }
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
    })
  )
  async create(
    @Body() dto: any,
    @UploadedFile() file?
  ) {
    console.log("create course ====>> " , dto)
    let courseData = dto;
    
    // Parse chapters if it's a string
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

    // Convert string numbers to actual numbers for Prisma
    const numericFields = ['minAge', 'maxAge', 'price', 'moduleId', 'academyId'];
    courseData = {
      ...courseData,
      ...numericFields.reduce((acc, field) => ({
        ...acc,
        [field]: courseData[field] !== undefined ? Number(courseData[field]) : undefined
      }), {})
    };

    console.log('create course (parsed) ====>>', courseData);

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

    console.log("create course (final) ====>> " , courseData)
    return this.courseService.create(courseData, coverPhotoUrl ?? undefined);
  }

  
  @Get('academy/:academyId')
  async getByAcademy(@Param('academyId') academyId: string) {
    return this.courseService.findByAcademy(Number(academyId));
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get course details by ID',
    description: 'Retrieves detailed information about a specific course including its chapters.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the course to retrieve',
    type: 'number',
    required: true,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Course details retrieved successfully',
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
        targetAudience: { type: 'string', example: 'Intermediate developers', nullable: true },
        prerequisites: { type: 'string', example: 'Basic web development knowledge', nullable: true },
        whatYouWillLearn: { type: 'string', example: 'Advanced concepts and best practices', nullable: true },
        whatYouCanDoAfter: { type: 'string', example: 'Build complex applications', nullable: true },
        minAge: { type: 'number', example: 16, nullable: true },
        maxAge: { type: 'number', example: 99, nullable: true },
        price: { type: 'number', example: 99.99, nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
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
  @ApiResponse({
    status: 404,
    description: 'Course not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Course not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  async getCourseDetails(@Param('id', ParseIntPipe) id: number) {
    const course = await this.courseService.getCourseDetails(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a course',
    description: 'Deletes a course and all its related data including chapters, sections, and groups.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the course to delete',
    type: 'number',
    required: true,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Course deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Course deleted successfully' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Course with ID 999 not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @HttpCode(HttpStatus.OK)
  async deleteCourse(@Param('id', ParseIntPipe) id: number) {
    await this.courseService.deleteCourse(id);
    return { message: 'Course deleted successfully' };
  }
}
