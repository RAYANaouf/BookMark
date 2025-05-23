import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {


    constructor(
        private prisma : PrismaService
    ){

    }

    async getUserByEmail(email: string) {
        return this.prisma.user.findFirst({
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
    }
      
}
