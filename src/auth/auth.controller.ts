import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, CreateSuperAdminDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController{
    constructor(private readonly authService: AuthService) {}




    @HttpCode(HttpStatus.CREATED)
    @Post("/signup")
    signup(@Body() authDto:AuthDto){
        return this.authService.signup(authDto)
    }

    @HttpCode(HttpStatus.OK)
    @Post("/login")
    login(@Body() authDto:AuthDto){
        return this.authService.login(authDto)
    }

    
    @HttpCode(HttpStatus.CREATED)
    @Post("/createSuperAdmin")
    createSuperAdmin(@Body() createSuperAdminDto : CreateSuperAdminDto){
        return this.authService.createSuperAdmin(createSuperAdminDto)
    }

}