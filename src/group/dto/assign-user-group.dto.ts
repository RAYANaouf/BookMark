import { IsEnum, IsInt } from 'class-validator';

export enum UserGroupRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export class AssignUserGroupDto {
  @IsInt()
  userId: number;

  @IsInt()
  groupId: number;

  @IsEnum(UserGroupRole)
  role: UserGroupRole;
}
