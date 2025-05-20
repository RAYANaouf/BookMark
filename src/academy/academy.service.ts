import { Injectable, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { AcademyDto, CreateAcademyDto } from './dto';

@Injectable()
export class AcademyService {

    constructor(
        private prisma : PrismaService
    ){}

    getAllAcademies(){
        return this.prisma.academy.findMany()
    }

    createAcademy(academy : CreateAcademyDto){
        return this.prisma.academy.create({
            data : {
                name     : academy.name,
                logo     : academy.logo || ""
            }
        })
    }

    //@UseGuards(JwtGuard)
    getAcademyById(id : number){
        return this.prisma.academy.findUnique({
            where : {
                id : id
            }
        })
    }


}
