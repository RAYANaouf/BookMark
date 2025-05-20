import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email : string

    @IsString()
    @IsNotEmpty()
    password : string
}


export class CreateSuperAdminDto {
    @IsEmail()
    @IsNotEmpty()
    email : string

    @IsString()
    @IsNotEmpty()
    password : string

    @IsString()
    firstName? : string

    @IsString()
    lastName? : string
}