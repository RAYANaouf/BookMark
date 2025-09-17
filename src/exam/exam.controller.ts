import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GetModuleLevelDto } from './dto/module-level.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('exams')
@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new exam' })
  @ApiResponse({ status: 201, description: 'Exam created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name     : { type: 'string', example : 'Exam 1' },
        dateTime : { type: 'string', format: 'date-time', example : '2025-09-14T18:34:36.000Z' },
        duration : { type: 'integer', example : 60 },
        groupId  : { type: 'integer', example : 1 },
      },
    },
  })
  create(@Body() createExamDto: CreateExamDto) {
    return this.examService.create(createExamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exams' })
  @ApiResponse({ status: 200, description: 'Returns all exams' })
  findAll() {
    return this.examService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an exam by ID' })
  @ApiResponse({ status: 200, description: 'Returns the exam' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.examService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an exam' })
  @ApiResponse({ status: 200, description: 'Exam updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Exam or group not found' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name     : { type: 'string', example : 'Exam 1' },
        dateTime : { type: 'string', format: 'date-time', example : '2025-09-14T18:34:36.000Z' },
        duration : { type: 'integer', example : 60 },
        groupId  : { type: 'integer', example : 1 },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExamDto: UpdateExamDto,
  ) {
    return this.examService.update(id, updateExamDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an exam' })
  @ApiResponse({ status: 204, description: 'Exam deleted successfully' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.examService.remove(id);
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Get all exams for a group' })
  @ApiResponse({ status: 200, description: 'Returns all exams for the group' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  getGroupExams(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.examService.getGroupExams(groupId);
  }

  @Put(':examId/grade/:userId')
  @ApiOperation({ summary: 'Update or create a grade for a student' })
  @ApiResponse({ status: 200, description: 'Grade updated/created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Exam or user not found' })
  updateGrade(
    @Param('examId', ParseIntPipe) examId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateGradeDto: UpdateGradeDto,
  ) {
    return this.examService.updateGrade(examId, userId, updateGradeDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all grades for a user' })
  @ApiResponse({ status: 200, description: 'Returns all grades for the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserGrades(@Param('userId', ParseIntPipe) userId: number) {
    return this.examService.getUserGrades(userId);
  }

  @Get('module-level/:moduleId/user/:userId')
  async getModuleLevel(
    @Param('moduleId') moduleId: string,
    @Param('userId') userId: string
  ) {
    return this.examService.calculateModuleLevel(
      parseInt(userId, 10),
      parseInt(moduleId, 10)
    );
  }
}
