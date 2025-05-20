import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator"




export class AcademyDto {

    @IsString()
    @IsNotEmpty()
    name : string

    @IsString()
    @IsNotEmpty()
    phone : string

    @IsEmail()
    @IsNotEmpty()
    email : string

    @IsString()
    @IsNotEmpty()
    password : string
}

export class CreateAcademyDto{
    @IsString()
    @IsNotEmpty()
    name : string

    logo? : string
}