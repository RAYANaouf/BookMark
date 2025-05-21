import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';

@Controller('super-admin')
export class SuperAdminController {

    constructor(
        private superAdminService : SuperAdminService
    ){}


    @Get("all")
    getAllSuperAdmin(){
        return this.superAdminService.getAllSuperAdmin()
    }

        
    @Get(":id")
    getSuperAdminById(@Param("id" , ParseIntPipe) id : number){
        return this.superAdminService.getSuperAdminById(id)
    }

}
