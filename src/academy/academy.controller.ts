import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AcademyService } from './academy.service';
import { AcademyDto, CreateAcademyDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, resolve } from 'path';
import * as firebaseAdmin from 'firebase-admin';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';


@Controller('academy')
export class AcademyController {

        constructor(
            private academyService : AcademyService
        ){}
    
        @Get("all")
        getAll(){
            console.log("we are just heeere.")
            return this.academyService.getAllAcademies()
        }
    
        @Get(":id")
        getAcademyById(@Param("id" , ParseIntPipe) id : number){
            return this.academyService.getAcademyById(id)
        }


        @Get(":id/owners")
        getAcademyOwners(@Param("id" , ParseIntPipe) id : number){
            return this.academyService.getAcademyOwners(id)
        }


        @Post(":id/add-owner")
        async addAcademyOwner(
            @Param("id" , ParseIntPipe) id : number,
            @Body('userId') userId : string
        ){
            return await this.academyService.assignUserToAcademy(parseInt(userId) , id)
        }

        
        @HttpCode(HttpStatus.CREATED)
        @Post("create")
        @UseInterceptors(
            FileInterceptor("logo",{
                storage : memoryStorage(), //in-memory buffer
                limits : {fileSize: 5 * 1024 * 1024 } //5MB limit
            })
        )
        @ApiOperation({ summary: 'Create a new academy' })
        @ApiConsumes('multipart/form-data')
        @ApiBody({
            schema: {
                type: 'object',
                properties: {
                    academy: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            logo: { type: 'string', format: 'binary' }
                        },
                    },
                },
            },
        })
        async createAcademy(
            @Body() academy : CreateAcademyDto,
            @UploadedFile() file? 
        ){
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

        @Post(":id/assign-role")
        @HttpCode(HttpStatus.CREATED)
        async assignRoleToUser(
            @Param("id", ParseIntPipe) academyId: number,
            @Body() assignRoleDto: { userId: number; roleName: string }
        ) {
            const { userId, roleName } = assignRoleDto;
            return await this.academyService.assignUserToAcademy(userId, academyId, roleName);
        }

        @Get("user/:userId")
        getAcademiesByUser(
          @Param("userId", ParseIntPipe) userId: number,
          @Query("role") role?: string // optional role filter, e.g., "owner"
        ) {
          return this.academyService.getAcademiesByUser(userId, role);
        }
        


}
