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
        })
    )
    async changeProfilePhoto(
        @Param('id' , ParseIntPipe) userId : number,
        @UploadedFile() file?
    ) {
        console.log("log we are here 1")
        let logoUrl : string | null = null
        if(file){
            
        console.log("log we are here 2")
            const fileName = 'profile_photo/' + uuidv4() + extname(file.originalname)

            const bucket = firebaseAdmin.storage().bucket()

            const fileUpload = bucket.file(fileName)

            const stream = fileUpload.createWriteStream({
                metadata : {
                    contentType : file.mimetype
                }
            })


            await new Promise((resolve , reject) => {

                
                console.log("log we are here 3")
                stream.on("error" , (error) => {
                    console.error("❌ Error uploading file:", error)
                    reject(error)
                })

                
                console.log("log we are here 4")
                stream.on("finish" , async () => {
                    console.log("✅ File uploaded successfully")
                    await fileUpload.makePublic();
                    logoUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
                    resolve(null)
                })

                console.log("log we are here 5")
                stream.end(file.buffer)
                
            })   
        }    

        
        console.log("log we are here 6")

        return this.userService.changeProfilePhoto(userId , logoUrl);
    }

    


}
