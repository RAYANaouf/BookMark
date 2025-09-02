import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupResponseDto } from './dto/group-response.dto';

@ApiTags('groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    description: 'Group details',
    schema: {
      example: {
        name: 'Group A',
        courseId: 1,
      }
    }
  })
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully', type: GroupResponseDto })
  async create(@Body() createGroupDto: CreateGroupDto): Promise<GroupResponseDto> {
    return this.groupService.create(createGroupDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a group' })
  @ApiBody({
    description: 'Group details',
    schema: {
      example: {
        name: 'Group A',
        courseId: 1,
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Group updated successfully', type: GroupResponseDto })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<GroupResponseDto> {
    return this.groupService.update(+id, updateGroupDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate a group' })
  @ApiResponse({ status: 204, description: 'Group deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async deactivate(@Param('id') id: string): Promise<void> {
    await this.groupService.deactivate(+id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a group by ID' })
  @ApiResponse({ status: 200, description: 'Group found', type: GroupResponseDto })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async findOne(@Param('id') id: string): Promise<GroupResponseDto> {
    return this.groupService.findOne(+id);
  }
}
