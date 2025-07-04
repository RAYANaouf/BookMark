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


    async editProfile(userDto : UserDto){
        const result = await this.prisma.user.update({
            where : {
                id : userDto.id
            },
            data : {
                firstName : userDto.firstName,
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
