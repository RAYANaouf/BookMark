import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, CreateSuperAdminDto, SignUpDto } from "./dto/auth.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';
import { extname, resolve } from 'path';
import * as firebaseAdmin from 'firebase-admin';

@Controller("auth")
export class AuthController{
    constructor(private readonly authService: AuthService) {}




    @HttpCode(HttpStatus.CREATED)
    @Post("/signup")
    signup(@Body() signUpDto:SignUpDto){
        return this.authService.signup(signUpDto)
    }

    @HttpCode(HttpStatus.OK)
    @Post("/login")
    login(@Body() authDto:AuthDto){
        return this.authService.login(authDto)
    }

    
    @HttpCode(HttpStatus.CREATED)
    @Post("/createSuperAdmin")
    @UseInterceptors(
        FileInterceptor("profilePhoto",{
            storage : memoryStorage(), //in-memory buffer
            limits : {fileSize : 5 * 1024 * 1024} //5MB limit  
        })
    )
    async createSuperAdmin(
        @Body() createSuperAdminDto : CreateSuperAdminDto,
        @UploadedFile() file?
    ){
        console.log("===========>  ",file)
        let photoProfileUrl : string = ""
        if(file){
            const fileName = 'super_admin/profile_photo/' + uuidv4() + extname(file.originalname)

            const bucket = firebaseAdmin.storage().bucket()

            const fileUpload = bucket.file(fileName)

            const stream = fileUpload.createWriteStream({
                metadata : {
                    contentType : file.mimetype
                }
            })


            await new Promise((resolve , reject) => {

                stream.on("error" , (error) => {
                    console.error("❌ Error uploading file:", error)
                    reject(error)
                })


                stream.on("finish" , async () => {
                    console.log("✅ File uploaded successfully")
                    await fileUpload.makePublic();
                    photoProfileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
                    resolve(null)
                })

                stream.end(file.buffer)
                
            })
            
        }

        
        return this.authService.createSuperAdmin(createSuperAdminDto , photoProfileUrl)
    }

}