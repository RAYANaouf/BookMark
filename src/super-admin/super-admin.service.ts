import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SuperAdminService {

    constructor(
        private prisma : PrismaService
    ){}


    async getAllSuperAdmin(){
        const superAdminList = await this.prisma.user.findMany({
            where : {
                isSuperAdmin : true
            },
        })

        const formattedList = superAdminList.map((superAdmin) => {
            return {
                id : superAdmin.id,
                createdAt : superAdmin.createdAt,
                updatedAt : superAdmin.updatedAt,
                firstName : superAdmin.firstName,
                lastName : superAdmin.lastName,
                profilePhoto : superAdmin.profilePhoto
            }
        })

        console.log("formattedList",formattedList)
        
        return { "superAdminList" : formattedList}
    }


    //@UseGuards(JwtGuard)
    async getSuperAdminById(id : number){
        const res = await this.prisma.user.findUnique({
            where : {
                id : id,
                isSuperAdmin : true
            },
        })
        console.log("res : " , res)
        return {
            id : res?.id,
            createdAt : res?.createdAt,
            updatedAt : res?.updatedAt,
            firstName : res?.firstName,
            lastName : res?.lastName,
            profilePhoto : res?.profilePhoto
        }
    }



    async deleteSuperAdmin(id: number): Promise<boolean> {
        try {
            const superAdmin = await this.prisma.user.findUnique({
                where: { 
                    id,
                    isSuperAdmin : true
                },
                include: {
                    account: true
                },
            });
    
            if (!superAdmin) return false;
    
            const userId = superAdmin.id;
            const accountId = superAdmin.account.id;
    
            // ⚠️ Transaction: All delete operations must succeed or all fail
            await this.prisma.$transaction([
                // Delete in order: User → Account
                this.prisma.user.delete({ where: { id: userId } }),
                this.prisma.account.delete({ where: { id: accountId } }),
            ]);
            
            return true;
        } catch (error) {
            console.error('❌ Error deleting super admin:', error);
            return false;
        }
    }
    



}
