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


    //@UseGuards(JwtGuard)
    async getSuperAdminById(id : number){
        const res = await this.prisma.superAdmin.findUnique({
            where : {
                id : id
            },
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
        console.log("res : " , res)
        return {
            
            id : res?.id,
            userId : res?.userId,
            createdAt : res?.createdAt,
            updatedAt : res?.updatedAt,
            firstName : res?.user?.firstName,
            lastName : res?.user?.lastName,
            profilePhoto : res?.user?.profilePhoto
        }
    }



    async deleteSuperAdmin(id: number): Promise<boolean> {
        try {
            const superAdmin = await this.prisma.superAdmin.findUnique({
                where: { id },
                include: {
                    user: {
                        include: {
                            account: true,
                        },
                    },
                },
            });
    
            if (!superAdmin) return false;
    
            const userId = superAdmin.userId;
            const accountId = superAdmin.user.accountId;
    
            // ⚠️ Transaction: All delete operations must succeed or all fail
            await this.prisma.$transaction([
                // Delete in order: SuperAdmin → User → Account
                this.prisma.superAdmin.delete({ where: { id } }),
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
