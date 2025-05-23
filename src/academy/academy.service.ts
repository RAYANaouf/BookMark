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

    createAcademy(academy : CreateAcademyDto , logoUrl : string | null){
        return this.prisma.academy.create({
            data : {
                name     : academy.name,
                logo     : logoUrl || ""
            }
        })
    }

    //@UseGuards(JwtGuard)
    async getAcademyById(id: number) {
        const academy = await this.prisma.academy.findUnique({
          where: { id },
          include: {
            userLinks: {
              select: {
                userId: true
              }
            }
          }
        });
      
        if (!academy) return null;
      
        return {
          id: academy.id,
          name: academy.name,
          logo: academy.logo,
          phone: academy.phone,
          email: academy.email,
          owners: academy.userLinks.map(link => link.userId)
        };
      }


}
