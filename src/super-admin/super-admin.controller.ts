import { Controller, Get } from '@nestjs/common';
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

}
