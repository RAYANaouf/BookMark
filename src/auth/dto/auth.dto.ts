import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email : string

    @IsString()
    @IsNotEmpty()
    password : string
}

export class SignUpDto{
    @IsEmail()
    @IsNotEmpty()
    email : string

    @IsString()
    @IsNotEmpty()
    password : string

    @IsString()
    phone? : string

    @IsString()
    firstName? : string

    @IsString()
    lastName? : string

    @IsString()
    profilePhoto? : string
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