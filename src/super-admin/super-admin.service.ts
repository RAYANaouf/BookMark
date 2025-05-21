import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SuperAdminService {

    constructor(
        private prisma : PrismaService
    ){}


    async getAllSuperAdmin(){
        const superAdminList = await this.prisma.superAdmin.findMany({
            include : {
                user : {
                    select : {
                        firstName : true ,
                        lastName  : true ,
                        profilePhoto : true
                    }
                }
            }
        })

        const formattedList = superAdminList.map((superAdmin) => {
            return {
                id : superAdmin.id,
                userId : superAdmin.userId,
                createdAt : superAdmin.createdAt,
                updatedAt : superAdmin.updatedAt,
                firstName : superAdmin.user.firstName,
                lastName : superAdmin.user.lastName,
                profilePhoto : superAdmin.user.profilePhoto
            }
        })

        console.log("formattedList",formattedList)
        
        return { "superAdminList" : formattedList}
    }





}
