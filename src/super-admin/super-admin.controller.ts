import { Controller, Delete, Get, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
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


    @Delete(':id')
    async deleteSuperAdmin(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.superAdminService.deleteSuperAdmin(id);
    if (!deleted) {
      throw new NotFoundException(`Super admin with ID ${id} not found`);
    }
    return { message: 'Super admin deleted successfully' };
  }

}
