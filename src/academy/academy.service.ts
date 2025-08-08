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
          isSuperAdmin : link.user.isSuperAdmin,
          email : link.user.account.email
        }))
      }
      
    }



    async assignUserToAcademy(userId: number, academyId: number, roleName: string = 'owner'): Promise<boolean> {
      try {
        // First, find the role by name
        const role = await this.prisma.role.findUnique({
          where: { name: roleName },
        });

        if (!role) {
          throw new Error(`Role '${roleName}' not found`);
        }

        // Check if the user already has this role for this academy
        const existingAssignment = await this.prisma.userAcademy.findUnique({
          where: {
            userId_academyId_roleId : {
              userId,
              academyId,
              roleId:role.id
            }
          },
        });

        if (existingAssignment) {
          console.warn(`User ${userId} already has role '${roleName}' for academy ${academyId}`);
          return false;
        }

        // Create new role assignment
        await this.prisma.userAcademy.create({
          data: { 
            userId,
            academyId,
            roleId: role.id
          }
        });
        
        console.log(`Assigned role '${roleName}' to user ${userId} for academy ${academyId}`);
        return true;
      } catch (error) {
        console.error('Error in assignUserToAcademy:', error);
        if (error.code === 'P2002') { // Prisma unique constraint violation
          console.warn('Duplicate role assignment detected');
          return false;
        }
        throw new Error(`Failed to assign user to academy: ${error.message}`);
      }
    }

    async getUserAcademyRoles(userId: number, academyId: number): Promise<string[]> {
      const userAcademies = await this.prisma.userAcademy.findMany({
        where: {
          userId,
          academyId,
        },
        include: {
          role: true,
        },
      });

      return userAcademies.map(ua => ua.role.name);
    }

    async hasUserRoleInAcademy(
      userId: number, 
      academyId: number, 
      roleName: string
    ): Promise<boolean> {
      const roles = await this.getUserAcademyRoles(userId, academyId);
      return roles.includes(roleName);
    }

    async getAcademiesByUser(userId: number, roleName?: string) {
      return this.prisma.academy.findMany({
        where: {
          userLinks: {
            some: {
              userId,
              ...(roleName && {
                role: {
                  name: roleName
                }
              }),
            },
          },
        },
        include: {
          userLinks: {
            where: { userId },
            include: {
              role: true
            }
          }
        }
      });
    }
    


}
