import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TeacherService } from './teacher.service';




@Controller('teacher')
export class TeacherController {

    constructor(
        private teacherService : TeacherService
    ){}

    @Get("all")
    getAll(){
        return this.teacherService.getAllTeachers()
    }

    @Get(":id")
    getTeacherById(@Param("id" , ParseIntPipe) id : number){
        return this.teacherService.getTeacherById(id)
    }

}

