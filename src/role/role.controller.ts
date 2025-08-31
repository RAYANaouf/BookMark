import { Controller, Get, Post, Body, Param, Put, Delete, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post("create")
  @ApiOperation({ 
    summary: 'Create a new role',
    description: 'Creates a new role with the provided details. Role names must be unique.'
  })
  @ApiBody({ 
    description: 'Role details',
    schema: {
      example: {
        name: 'owner',
        description: 'the owner of the academy'
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'The role has been successfully created.',
    schema: {
      example: {
        id: 1,
        name: 'owner',
        description: 'the owner of the academy',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
      }
    }
  })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiBody({ 
    description: 'Role details',
    schema: {
      example: {
        name: 'owner',
        description: 'the owner of the academy'
      }
    }
   })
  @ApiResponse({ status: HttpStatus.OK, description: 'The role has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Role with this name already exists.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Get("all")
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all roles.' })
  async findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the role.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a role',
    description: 'Deletes a role by ID. This operation is irreversible.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID of the role to delete',
    type: 'number' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The role has been successfully deleted.',
    schema: {
      example: {
        message: 'Role deleted successfully',
        deletedRole: {
          id: 1,
          name: 'owner',
          description: 'the owner of the academy',
          deletedAt: '2025-01-01T00:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Role not found.' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Cannot delete role because it is assigned to users.'
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }
}
