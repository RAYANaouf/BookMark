import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { Bookmark   } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";


@Injectable({})
export class AuthService{
    constructor(private prisma : PrismaService){}
    async signup( dto : AuthDto){
        try{
            // generate the password hash 
            const hash = await argon.hash(dto.password)
            //save the new user in db
            const user = await this.prisma.user.create({
                data:{
                    email : dto.email,
                    hash
                },
                select : {
                    id : true,
                    email : true,
                    createdAt : true
                }
            })
        
            //return the saved user
            return user ;
        }
        catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if(e.code === 'P2002'){
                    throw new ForbiddenException('Email already exists')
                }
            }
        }
    }


    login(){
        return ""
    }
}
