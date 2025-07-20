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
            include: {
                account: {
                    select: {
                        email: true
                    }
                },
                academyLinks: {
                    select: {
                        academyId: true,
                        role: true,
                        academy: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                enrollmentRequests: {
                    include: {
                        courses: {
                            select: {
                                id: true,
                                name: true,
                                coverPhoto: true,
                                description: true,
                                academy: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return {
            id: user.id,
            email: user.account.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePhoto: user.profilePhoto,
            roles: user.academyLinks.map(link => ({
                academyId: link.academyId,
                academyName: link.academy.name,
                role: link.role
            }))
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
