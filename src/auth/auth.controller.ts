import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController{
    constructor(private readonly authService: AuthService) {}

    @Post("/signup")
    signup(@Body() authDto:AuthDto){
        console.log({
            dto : authDto
        })
        return this.authService.signup(authDto)
    }


    @Post("/login")
    login(){
        return this.authService.login()
    }

}