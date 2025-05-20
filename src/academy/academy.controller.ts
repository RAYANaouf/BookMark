import { Body, Controller, Get, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AcademyService } from './academy.service';
import { AcademyDto, CreateAcademyDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

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

        @Post("create")
        @UseInterceptors(
            FileInterceptor("logo",{
                storage : memoryStorage(), //in-memory buffer
                limits : {fileSize: 5 * 1024 * 1024 } //5MB limit
            })
        )
        createAcademy(
            @Body() academy : CreateAcademyDto,
            @UploadedFile() file? 
        ){
            console.log("===========>  ",file)
            return this.academyService.createAcademy(academy)
        }

}
