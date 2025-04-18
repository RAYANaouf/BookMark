import { Injectable } from "@nestjs/common";
import { Bookmark   } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable({})
export class AuthService{
    constructor(private prisma : PrismaService){}
    signup(){
        return {msg : "i have signed in"}
    }
    login(){
        return {msg : "i have logged in"}
    }
}