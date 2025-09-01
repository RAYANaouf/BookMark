import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { JwtGuard } from 'src/auth/guard';
import { AddTeacherDto } from './dto/add-teacher.dto';
import { RemoveTeacherDto } from './dto/remove-teacher.dto';

@Controller('teacher')
@UseGuards(JwtGuard)
export class TeacherController {
    constructor(private readonly teacherService: TeacherService) {}

    @Get()
    async getAllTeachers() {
        return this.teacherService.getAllTeachers();
    }

    @Get('academy/:academyId')
    async getTeachersByAcademy(
        @Param('academyId', ParseIntPipe) academyId: number
    ) {
        return this.teacherService.getTeachersByAcademy(academyId);
    }


}
