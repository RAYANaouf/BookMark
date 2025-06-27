import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, resolve } from 'path';
import * as firebaseAdmin from 'firebase-admin';

@Controller('post')
export class PostController {
    
    constructor(private readonly postService: PostService) {}


    @HttpCode(HttpStatus.OK)
    @Get('all')
    getAll(){
        return this.postService.getAll()
    }

    @HttpCode(HttpStatus.OK)
    @Get('academy/:academyId')
    getByAcademy(@Param('academyId') academyId: string) {
        return this.postService.findByAcademy(Number(academyId));
    }

    
    @HttpCode(HttpStatus.CREATED)
    @Post('create')
    @UseInterceptors(
        FileInterceptor("logo",{
            storage : memoryStorage(), //in-memory buffer
            limits : {fileSize: 5 * 1024 * 1024 } //5MB limit
        })
    )
    async create(
        @Body() dto: CreatePostDto,
        @UploadedFile() file? 
    ) {

        console.log("create post request : ", dto);
        
        let logoUrl : string | null = null
        if(file){
            const fileName = 'post_cover/' + uuidv4() + extname(file.originalname)
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
            
        return this.postService.create(dto , logoUrl)
    }
}
