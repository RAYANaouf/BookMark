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

    async getAcademyOwners(id: number){
      const result = await this.prisma.academy.findUnique({
        where: { id },
        include: {
          userLinks: {
            select: {
              user : {
                select : {
                  id : true,
                  firstName : true,
                  lastName : true,
                  profilePhoto : true,
                  isTeacher : true,
                  isStudent : true,
                  isParent : true,
                  isSuperAdmin : true,
                  account : {
                    select : {
                      email : true
                    }
                  }
                }
              }
            }
          }
        }
      });
      
      if (!result) return null;
      
      return {
        id: result.id,
        name: result.name,
        logo: result.logo,
        phone: result.phone,
        email: result.email,
        owners : result.userLinks.map(link => ({
          userId : link.user.id,
          firstName : link.user.firstName,
          lastName : link.user.lastName,
          profilePhoto : link.user.profilePhoto,
          isTeacher : link.user.isTeacher,
          isStudent : link.user.isStudent,
          isParent : link.user.isParent,
          isSuperAdmin : link.user.isSuperAdmin,
          email : link.user.account.email
        }))
      }
      
    }



    async assignUserToAcademy(userId: number, academyId: number): Promise<boolean> {
      try {

        await this.prisma.userAcademy.create({
          data: { 
            userId,
            academyId,
            role : "owner"
          }
        });
        return true;
      } catch (error) {
        if (
          error.code === "P2002" // Prisma unique constraint violation
        ) {
          console.warn("User is already assigned to this academy.");
          return false;
        }
        throw new Error("Failed to assign user to academy.");
      }
    }
    
    
    async getAcademiesByUser(userId: number, role?: string) {
      return this.prisma.academy.findMany({
        where: {
          userLinks: {
            some: {
              userId,
              ...(role && { role }),
            },
          },
        }
      });
    }
    


}
