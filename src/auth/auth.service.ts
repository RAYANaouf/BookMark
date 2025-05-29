import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, CreateSuperAdminDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { error } from "console";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";


@Injectable({})
export class AuthService{
    constructor(
        private prisma : PrismaService,
        private jwt : JwtService,
        private config : ConfigService
    ){}


    async signup( dto : AuthDto){
        try{
            // generate the password hash 
            const hash = await argon.hash(dto.password)
            //save the new user in db
            const user = await this.prisma.account.create({
                data:{
                    email : dto.email,
                    hash
                },
                select : {
                    id : true,
                    email : true
                }
            })
        
            //return the saved user
            return this.signTocken(user.id , user.email) ;
        }
        catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if(e.code === 'P2002'){
                    throw new ForbiddenException('Email already exists')
                }
            }
            throw e
        }
    }


    async login(dto : AuthDto){
        // find the user by email    
        const account = await this.prisma.account.findUnique({
            where : {
                email : dto.email,
            },
            include : {
                user : {
                    select : {
                        id : true,
                        isSuperAdmin : true,
                        isStudent : true,
                        isParent : true,
                        isTeacher : true,
                        
                        firstName : true,
                        lastName : true,
                        profilePhoto : true,
                    }
                }
            }
        })
        //if user does not exist throw exception
        if(!account) throw new ForbiddenException('Credentials incorrect')
        // compare password
        const isPasswordMatch = await argon.verify(account.hash, dto.password)
        //if password incorrect throw exception
        if(!isPasswordMatch){
            throw new ForbiddenException('Credentials incorrect')
        }
        //send back the user
        const token = await this.signTocken(account.id , account.email)

        
        
        return {
            "access_token" : token.access_token,
            "accountId"    : account.id,
            "userId"       : account.user?.id,
            "firstName"    : account.user?.firstName,
            "lastName"     : account.user?.lastName,
            "profilePhoto" : account.user?.profilePhoto,
            "email"        : account.email,
            "isSuperAdmin" : account.user?.isSuperAdmin,
            "isStudent"    : account.user?.isStudent,
            "isParent"     : account.user?.isParent,
            "isTeacher"    : account.user?.isTeacher,
        }
    }




    async createSuperAdmin(createSuperAdminDto: CreateSuperAdminDto , photoProfileUrl : string) {
        
        const exist = await this.prisma.account.findUnique({
            where: { email: createSuperAdminDto.email }
        });
        if (exist) {
            throw new BadRequestException('Email already exist');
        }
    
        const hash = await argon.hash(createSuperAdminDto.password);
    
        const account = await this.prisma.account.create({
            data: {
                email: createSuperAdminDto.email,
                hash,
                user: {
                    create: {
                        isSuperAdmin: true,
                        firstName : createSuperAdminDto.firstName ?? "empty",
                        lastName : createSuperAdminDto.lastName ?? "empty",
                        profilePhoto : photoProfileUrl ?? "",
                        superAdmin : {
                            create : {}
                        }
                    }
                }
            }
        });
    
        return await this.signTocken(account.id, account.email);
    }
    


    async signTocken(
        userid : number,
        email  : string
    ) : Promise<{access_token : String}>{

        const payload = {
            sub : userid,
            email
        }
        const secret = this.config.get('JWT_SECRET')

        const token = await this.jwt.signAsync(
            payload,
            {
                expiresIn : '1440m',
                secret : secret
            }
        )


        return {
            access_token : token,
        }

        
    }



}
