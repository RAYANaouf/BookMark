import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator"




export class CreatePostDto {

    @IsNumber()
    @IsNotEmpty()
    academyId : number
    
    @IsString()
    @IsNotEmpty()
    title : string

    @IsString()
    @IsNotEmpty()
    content : string

}

