import { Controller, Get } from "@nestjs/common";





@Controller('')
export class AppController {

    @Get()
    editUser(){
        return "hello there "
    }

}