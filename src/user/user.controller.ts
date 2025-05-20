import { Controller, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { userInfo } from 'os';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/decoretor/get-user.decorator';





@Controller('user')
export class UserController {



    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.OK)
    @Get('me')
    getMe(){
        return "user"
    }



}
