import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {

    constructor(
        private prisma : PrismaService
    ){

    }

    async getUserByEmail(email: string) {
        const result = await this.prisma.user.findFirst({
            where : {
                account : {
                    email : email
                }
            },
            select : {
                id : true,
                firstName : true ,
                lastName : true ,
                profilePhoto : true
            }
        });

        if(!result){
            throw new Error("User not found");
        }

        return {
            userId : result.id,
            firstName : result.firstName,
            lastName : result.lastName,
            profilePhoto : result.profilePhoto
        }

    }


    async getUserById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePhoto: true,
                account: {
                    select: {
                        email: true
                    }
                },
                academyLinks: {
                    include: {
                        academy: {
                            include: {
                                address: true,
                                courses: {
                                    include: {
                                        groups: {
                                            include: {
                                                userGroups: {
                                                    where: { userId: id }
                                                }
                                            }
                                        },
                                        module: true
                                    }
                                }
                            }
                        },
                        role: true
                    }
                },
                userGroup: {
                    include: {
                        group: {
                            include: {
                                course: {
                                    include: {
                                        academy: true,
                                        module: true
                                    }
                                }
                            }
                        }
                    }
                },
                enrollmentRequests: {
                    include: {
                        courses: {
                            include: {
                                academy: true
                            }
                        }
                    }
                },
                createdAt: true,
                updatedAt: true
            },
        });

        if (!user) {
            return null;
        }

        

        // Process groups where user is a member
        const userGroups = user.userGroup.map(ug => ({
            id: ug.group.id,
            name: ug.group.name,
            role: ug.role,
            course: ug.group.course ? {
              id: ug.group.course.id,
              name: ug.group.course.name,
              academy: {
                id: ug.group.course.academy.id,
                name: ug.group.course.academy.name
              }
            } : null
          }));

        // Process pending enrollments
        const pendingEnrollments = user.enrollmentRequests
            .filter(req => req.status === 'Pending')
            .map(req => ({
                courseId: req.courses.id,
                courseName: req.courses.name,
                academyId: req.courses.academy.id,
                academyName: req.courses.academy.name,
                status: req.status,
                requestedAt: req.createdAt
            }));

        // Remove sensitive data and restructure the response
        const { ...userData } = user;
        
        return {
            ...userData,
            groups: userGroups,
            pendingEnrollments
        };
    }

    async editProfile(userDto: UserDto) {
        const result = await this.prisma.user.update({
            where: {
                id: userDto.id
            },
            data: {
                firstName: userDto.firstName,
                lastName : userDto.lastName,
                profilePhoto : userDto.profilePhoto
            }
        });

        return true
    }


    async changeProfilePhoto( userId : number , profilePhoto : string | null){
        if(profilePhoto != null && profilePhoto != ""){
            return await this.prisma.user.update(
                {
                    where : {
                        id : userId
                    },
                    data : {
                        profilePhoto : profilePhoto
                    },
                    select : {
                        profilePhoto : true
                    }
                }
            )
        }else{
            return ""
        }
    }
      
}
