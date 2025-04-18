import { Body, Controller, ParseIntPipe, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController{
    constructor(private readonly authService: AuthService) {}

    @Post("/signup")
    signup(
        @Body('email') 
        email : string,
        @Body('password' , ParseIntPipe)
        password : string
    ){
        console.log({
            email : email,
            typeOfEmail : typeof email,
            typeOfPassword : typeof password,
            password : password
        })
        return this.authService.signup()
    }

    @Post("/login")
    login(){
        return this.authService.login()
    }

}