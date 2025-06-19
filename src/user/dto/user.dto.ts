import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator"



export class UserDto{

    @IsNumber()
    id : number
    
    @IsString()
    phone? : string

    @IsString()
    firstName? : string

    @IsString()
    lastName? : string

    
    profilePhoto? : string
}
