import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { GroupResponseDto } from './dto/group-response.dto';
import { AssignUserGroupDto } from './dto/assign-user-group.dto';
import { UserGroupResponseDto } from './dto/user-group-response.dto';

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

  @Post(':id/members')
  @ApiOperation({ summary: 'Add a user to a group' })
  @ApiBody({ 
    schema: {
      example: {
        userId: 1,
        groupId: 1,
        role: 'STUDENT',
      },
    }, 
  })
  @ApiResponse({ status: 201, description: 'User added to group successfully' })
  @ApiResponse({ status: 404, description: 'User or group not found' })
  @ApiResponse({ status: 409, description: 'User is already in the group' })
  async addUserToGroup(
    @Body() assignDto: AssignUserGroupDto,
  ): Promise<{ message: string }> {
    return this.groupService.assignUser(assignDto);
  }

  @Delete(':groupId/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a user from a group' })
  @ApiParam({ name: 'groupId', description: 'Group ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User removed from group successfully' })
  @ApiResponse({ status: 404, description: 'User or group not found' })
  async removeUserFromGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.groupService.removeUserFromGroup(+userId, +groupId);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get all members of a group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of group members', 
    type: [UserGroupResponseDto],
    schema: {
      example: [{
        userId: 1,
        groupId: 1,
        role: 'STUDENT',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      }]
    }
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async getGroupMembers(@Param('id') id: string): Promise<UserGroupResponseDto[]> {
    return this.groupService.getGroupMembers(+id);
  }
}
