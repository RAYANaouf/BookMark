import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { Bookmark   } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";
import { error } from "console";
import { JwtService } from "@nestjs/jwt";


@Injectable({})
export class AuthService{
    constructor(
        private prisma : PrismaService,
        private jwt : JwtService
    ){}
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
            throw error
        }
    }


    async login(dto : AuthDto){
        // find the user by email    
        const user = await this.prisma.user.findUnique({
            where : {
                email : dto.email
            }
        })
        //if user does not exist throw exception
        if(!user) throw new ForbiddenException('Credentials incorrect')
        // compare password
        const isPasswordMatch = await argon.verify(user.hash, dto.password)
        //if password incorrect throw exception
        if(!isPasswordMatch){
            throw new ForbiddenException('Credentials incorrect')
        }
        //send back the user
        return user
    }
}
