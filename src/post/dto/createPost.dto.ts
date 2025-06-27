import { Type } from "class-transformer"
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator"




export class CreatePostDto {

    @IsNumber()
    @Type(() => Number)
    academyId : number
    
    @IsString()
    @IsNotEmpty()
    title : string

    @IsString()
    @IsNotEmpty()
    content : string

}

