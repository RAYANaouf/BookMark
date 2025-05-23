import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AcademyService } from './academy.service';
import { AcademyDto, CreateAcademyDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, resolve } from 'path';
import * as firebaseAdmin from 'firebase-admin';


@Controller('academy')
export class AcademyController {

        constructor(
            private academyService : AcademyService
        ){}
    
        @Get("all")
        getAll(){
            return this.academyService.getAllAcademies()
        }
    
        @Get(":id")
        getAcademyById(@Param("id" , ParseIntPipe) id : number){
            return this.academyService.getAcademyById(id)
        }

        
        @HttpCode(HttpStatus.CREATED)
        @Post("create")
        @UseInterceptors(
            FileInterceptor("logo",{
                storage : memoryStorage(), //in-memory buffer
                limits : {fileSize: 5 * 1024 * 1024 } //5MB limit
            })
        )

        
        async createAcademy(
            @Body() academy : CreateAcademyDto,
            @UploadedFile() file? 
        ){
            console.log("===========>  ",file)
            let logoUrl : string | null = null
            if(file){
                const fileName = 'academy_logo/' + uuidv4() + extname(file.originalname)

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

            
            return this.academyService.createAcademy(academy , logoUrl)
        }

}
