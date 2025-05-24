import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
      
}
