// src/group/dto/user-group-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserGroupRole } from './assign-user-group.dto';

export class UserGroupResponseDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  userId: number;

  @ApiProperty({ description: 'Group ID', example: 1 })
  groupId: number;

  @ApiProperty({ 
    enum: UserGroupRole, 
    description: 'User role in the group',
    example: UserGroupRole.STUDENT
  })
  role: UserGroupRole;

  firstName: string;  // Direct property
  lastName: string;   // Direct property

  @ApiProperty({ 
    description: 'User email', 
    example: 'john.doe@example.com',
    required: false 
  })
  email?: string;
}