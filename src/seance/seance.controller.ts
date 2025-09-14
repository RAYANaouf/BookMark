import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
