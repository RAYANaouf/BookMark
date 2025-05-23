import { Controller, Get, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { userInfo } from 'os';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/decoretor/get-user.decorator';
import { UserService } from './user.service';





@Controller('user')
export class UserController {


    constructor(
        private userService : UserService
    ){

    }


    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.OK)
    @Get('me')
    getMe(){
        return "user"
    }


    @Get('by-email/:email')
    getUserByEmail(@Param('email') email: string) {
        return this.userService.getUserByEmail(email);
    }


}
