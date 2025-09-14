import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new attendance record' })
  @ApiResponse({ status: 201, description: 'Attendance record created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User or Seance not found' })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendance records' })
  @ApiResponse({ status: 200, description: 'Returns all attendance records' })
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get('seance/:seanceId/user/:userId')
  @ApiOperation({ summary: 'Get a specific attendance record' })
  @ApiResponse({ status: 200, description: 'Returns the attendance record' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  findOne(
    @Param('seanceId', ParseIntPipe) seanceId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.attendanceService.findOne(seanceId, userId);
  }

  @Put('seance/:seanceId/user/:userId')
  @ApiOperation({ summary: 'Update an attendance record' })
  @ApiResponse({ status: 200, description: 'Attendance record updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  update(
    @Param('seanceId', ParseIntPipe) seanceId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(
      seanceId,
      userId,
      updateAttendanceDto,
    );
  }

  @Delete('seance/:seanceId/user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an attendance record' })
  @ApiResponse({ status: 204, description: 'Attendance record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  remove(
    @Param('seanceId', ParseIntPipe) seanceId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.attendanceService.remove(seanceId, userId);
  }

  @Get('seance/:seanceId')
  @ApiOperation({ summary: 'Get all attendance records for a specific seance' })
  @ApiResponse({ status: 200, description: 'Returns attendance records for the seance' })
  @ApiResponse({ status: 404, description: 'Seance not found' })
  getSeanceAttendances(@Param('seanceId', ParseIntPipe) seanceId: number) {
    return this.attendanceService.getSeanceAttendances(seanceId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all attendance records for a specific user' })
  @ApiResponse({ status: 200, description: 'Returns attendance records for the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserAttendances(@Param('userId', ParseIntPipe) userId: number) {
    return this.attendanceService.getUserAttendances(userId);
  }

  @Post('checkin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Check in a user for a seance' })
  @ApiResponse({ status: 201, description: 'Checked in successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User or Seance not found' })
  checkIn(
    @Body() createAttendanceDto: CreateAttendanceDto,
  ) {
    return this.attendanceService.create({
      ...createAttendanceDto,
      checkinAt: new Date(),
    });
  }

  @Put('checkout')
  @ApiOperation({ summary: 'Check out a user from a seance' })
  @ApiResponse({ status: 200, description: 'Checked out successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  checkOut(
    @Body() updateAttendanceDto: UpdateAttendanceDto & { seanceId: number; userId: number },
  ) {
    return this.attendanceService.update(
      updateAttendanceDto.seanceId,
      updateAttendanceDto.userId,
      {
        ...updateAttendanceDto,
        checkoutAt: new Date(),
      },
    );
  }
}
