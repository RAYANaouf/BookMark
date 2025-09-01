import { Controller, Get, Post, Body, Param, Put, Delete, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@ApiTags('modules')
@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post('create')
  @ApiOperation({ 
    summary: 'Create a new module',
    description: 'Creates a new module with the provided details. Module names must be unique.'
  })
  @ApiBody({ 
    description: 'Module details',
    schema: {
      example: {
        name: 'user-management',
        description: 'User management module'
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'The module has been successfully created.',
  })
  async create(@Body() createModuleDto: CreateModuleDto) {
    return this.moduleService.create(createModuleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a module' })
  @ApiParam({ name: 'id', description: 'Module ID' })
  @ApiBody({ 
    description: 'Module details to update',
    schema: {
      example: {
        name: 'user-management',
        description: 'Updated user management module'
      }
    }
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'The module has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Module not found.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Module with this name already exists.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    return this.moduleService.update(id, updateModuleDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all modules' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all modules.' })
  async findAll() {
    return this.moduleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a module by ID' })
  @ApiParam({ name: 'id', description: 'Module ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the module.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Module not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moduleService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a module',
    description: 'Deletes a module by ID. This operation is irreversible.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID of the module to delete',
    type: 'number' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The module has been successfully deleted.',
    schema: {
      example: {
        message: 'Module deleted successfully',
        deletedModule: {
          id: 1,
          name: 'user-management',
          description: 'User management module',
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Module not found.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.moduleService.remove(id);
  }
}
