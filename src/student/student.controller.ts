import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {

    constructor( private studentService : StudentService){

    }

    @Get("academy/:id")
    getAllStudentByAcademyId(@Param("id" , ParseIntPipe) id : number){
        return this.studentService.getAllStudentByAcademyId(id);
    }

}
