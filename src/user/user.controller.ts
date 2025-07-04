import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { userInfo } from 'os';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/decoretor/get-user.decorator';
import { UserService } from './user.service';
import { UserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, resolve } from 'path';
import * as firebaseAdmin from 'firebase-admin';





@Controller('user')
export class UserController {


    constructor(
        private userService : UserService
    ){

    }


    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.OK)
    @Get('me')
    getMe(){
        return "user"
    }


    @Get('by-email/:email')
    getUserByEmail(@Param('email') email: string) {
        return this.userService.getUserByEmail(email);
    }


    
    @Post('edit-profile/:id')
    editProfile(@Body() userDto : UserDto) {
        return this.userService.editProfile(userDto);
    }

    @Post('change-profilePhoto/:id')
    @UseInterceptors(
        FileInterceptor("profilePhoto",{
            storage : memoryStorage(), //in-memory buffer
            limits : {fileSize: 5 * 1024 * 1024 } //5MB limit
        })
    )
    async changeProfilePhoto(
        @Param('id' , ParseIntPipe) userId : number,
        @UploadedFile() file?
    ) {
        let logoUrl : string | null = null
        if(file){
            const fileName = 'profile_photo/' + uuidv4() + extname(file.originalname)

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
                    logoUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
                    resolve(null)
                })

                stream.end(file.buffer)
                
            })   
        }    
        return this.userService.changeProfilePhoto(userId , logoUrl);
    }

    


}
