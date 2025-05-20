import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class TeacherService {

    constructor(
        private prisma : PrismaService
    ){

    }


    getAllTeachers(){
        return this.prisma.teacher.findMany()
    }

    getTeacherById(id : number){
        return this.prisma.teacher.findUnique({
            where : {
                id : id
            }
        })
    }

}
