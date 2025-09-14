import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SeanceService } from './seance.service';
import { CreateSeanceDto } from './dto/create-seance.dto';
import { UpdateSeanceDto } from './dto/update-seance.dto';

@ApiTags('seances')
@Controller('seances')
export class SeanceController {
  constructor(private readonly seanceService: SeanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new seance' })
  @ApiResponse({ status: 201, description: 'The seance has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiBody({
     schema : {
        type : 'object',
        properties : {
            title : { type : 'string' , example : 'Seance Title' , description : 'The title of the seance' },
            date : { type : 'string' , example : '2025-09-14' , format : 'date' , description : 'The date of the seance' },
            startTime : { type : 'string' , example : '14:00' , format : 'time' , description : 'The start time of the seance' },
            endTime : { type : 'string' , example : '16:00' , format : 'time' , description : 'The end time of the seance' },
            notes : { type : 'string' , example : 'Seance Notes' , description : 'The notes of the seance' },
            meetingUrl : { type : 'string' , example : 'https://zoom.us/j/123456789' , description : 'The meeting URL of the seance' },
            mode : { type : 'string' , example : 'ONSITE' , description : '===> ONSITE or ONLINE <===' },
            groupId : { type : 'integer' , example : 1 , description : 'The group ID of the seance' },
            teacherId : { type : 'integer' , example : 1 , description : 'The teacher ID of the seance' },
            chapterId : { type : 'integer' , example : 1 , description : 'The chapter ID of the seance' },
        }
     }
  })
  create(@Body() createSeanceDto: CreateSeanceDto) {
    return this.seanceService.create(createSeanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all seances' })
  @ApiResponse({ status: 200, description: 'Return all seances' })
  findAll() {
    return this.seanceService.findAll();
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Get seances by group' })
  @ApiResponse({ status: 200, description: 'Return seances for the specified group' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  findByGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.seanceService.getSeancesByGroup(groupId);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Get seances by teacher' })
  @ApiResponse({ status: 200, description: 'Return seances for the specified teacher' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  findByTeacher(@Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.seanceService.getSeancesByTeacher(teacherId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a seance by ID' })
  @ApiResponse({ status: 200, description: 'Return the seance' })
  @ApiResponse({ status: 404, description: 'Seance not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.seanceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a seance' })
  @ApiResponse({ status: 200, description: 'The seance has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Seance not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSeanceDto: UpdateSeanceDto,
  ) {
    return this.seanceService.update(id, updateSeanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a seance' })
  @ApiResponse({ status: 200, description: 'The seance has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Seance not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.seanceService.remove(id);
  }
}
