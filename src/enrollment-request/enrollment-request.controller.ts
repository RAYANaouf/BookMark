import { Controller, Post, Body, UseGuards, Patch, Param, ParseIntPipe, Get, Query } from '@nestjs/common';
import { EnrollmentRequestService } from './enrollment-request.service';
import { CreateEnrollmentRequestDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@Controller('enrollment-request')
export class EnrollmentRequestController {
    constructor(private readonly enrollmentRequestService: EnrollmentRequestService) {}

    @Post('create')
    async create(@Body() dto: CreateEnrollmentRequestDto) {
        return this.enrollmentRequestService.create(dto);
    }


    
    @UseGuards(JwtGuard)
    @Get('course/:courseId')
    async getByCourseId(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.enrollmentRequestService.getRequestsByCourseId(courseId);
    }

    @UseGuards(JwtGuard)
    @Patch(':id/accept')
    async acceptRequest(@Param('id', ParseIntPipe) id: number) {
        return this.enrollmentRequestService.acceptRequest(id);
    }
}
