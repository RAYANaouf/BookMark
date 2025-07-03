import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentService {


    constructor( private prisma : PrismaService){

    }

    async getAllStudentByAcademyId( id : number){
        return this.prisma.user.findMany({
            where : {
                academyLinks : {
                    some : {
                        academyId : id,
                        role      : "Student"
                    }
                }
            }
        })
    }
}
