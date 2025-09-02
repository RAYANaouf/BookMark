import { Controller, Get, Post, Body, Param, Delete, Put, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { ChapterResponseDto } from './dto/chapter-response.dto';

@ApiTags('chapters')
@Controller('chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chapter' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The chapter has been successfully created.',
    type: ChapterResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found',
  })
  @ApiBody({
    type: CreateChapterDto,
    schema : {
      example: {
        name: 'Chapter 1',
        description: 'Description of chapter 1',
        order: 1,
        courseId: 1,
      }
    }
  })
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chapterService.create(createChapterDto);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get all chapters for a course' })
  @ApiParam({
    name: 'courseId',
    description: 'ID of the course to get chapters for',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all chapters for the specified course',
    type: [ChapterResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found',
  })
  findAllByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.chapterService.findAllByCourse(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chapter by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the chapter to retrieve',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the requested chapter',
    type: ChapterResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Chapter not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chapterService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a chapter' })
  @ApiParam({
    name: 'id',
    description: 'ID of the chapter to update',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The chapter has been successfully updated.',
    type: ChapterResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Chapter or course not found',
  })
  @ApiBody({
    type: UpdateChapterDto,
    schema : {
      example: {
        name: 'Chapter 1',
        description: 'Description of chapter 1',
        order: 1,
        courseId: 1,
      }
    } 
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    return this.chapterService.update(id, updateChapterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chapter' })
  @ApiParam({
    name: 'id',
    description: 'ID of the chapter to delete',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The chapter has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Chapter not found',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chapterService.remove(id);
  }
}
