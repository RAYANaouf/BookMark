import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupResponseDto } from './dto/group-response.dto';
import { AssignUserGroupDto, UserGroupRole } from './dto/assign-user-group.dto';
import { UserGroupResponseDto } from './dto/user-group-response.dto';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async create(createGroupDto: CreateGroupDto): Promise<GroupResponseDto> {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: createGroupDto.courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${createGroupDto.courseId} not found`);
    }

    return this.prisma.group.create({
      data: {
        name: createGroupDto.name,
        courseId: createGroupDto.courseId,
      },
    });
  }

  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<GroupResponseDto> {
    // Check if group exists
    const group = await this.prisma.group.findUnique({
      where: { id },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return this.prisma.group.update({
      where: { id },
      data: {
        name: updateGroupDto.name,
        active: updateGroupDto.active,
      },
    });
  }

  async deactivate(id: number): Promise<GroupResponseDto> {
    // Check if group exists
    const group = await this.prisma.group.findUnique({
      where: { id },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return this.prisma.group.update({
      where: { id },
      data: {
        active: false,
      },
    });
  }

  async findOne(id: number): Promise<GroupResponseDto> {
    const group = await this.prisma.group.findUnique({
      where: { id },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return group;
  }

  async assignUser(assignDto: AssignUserGroupDto): Promise<{ message: string }> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: assignDto.userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${assignDto.userId} not found`);
    }

    // Check if group exists
    const group = await this.prisma.group.findUnique({
      where: { id: assignDto.groupId },
    });
    if (!group) {
      throw new NotFoundException(`Group with ID ${assignDto.groupId} not found`);
    }

    // Check if user is already in the group
    const existingAssignment = await this.prisma.userGroup.findUnique({
      where: {
        userId_groupId: {
          userId: assignDto.userId,
          groupId: assignDto.groupId,
        },
      },
    });

    if (existingAssignment) {
      // Update existing role if user is already in the group
      await this.prisma.userGroup.update({
        where: {
          userId_groupId: {
            userId: assignDto.userId,
            groupId: assignDto.groupId,
          },
        },
        data: {
          role: assignDto.role as any, // Cast to any to match Prisma's generated types
        },
      });
      return { message: 'User role updated in group successfully' };
    }

    // Create new user-group relationship
    await this.prisma.userGroup.create({
      data: {
        userId: assignDto.userId,
        groupId: assignDto.groupId,
        role: assignDto.role, // Remove the type assertion as it's already properly typed
      },
    });
    return { message: 'User assigned to group successfully' };
  }

  async removeUserFromGroup(userId: number, groupId: number): Promise<{ message: string }> {
    // Check if the assignment exists
    const assignment = await this.prisma.userGroup.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('User is not assigned to this group');
    }

    await this.prisma.userGroup.delete({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    return { message: 'User removed from group successfully' };
  }

  async getGroupMembers(groupId: number): Promise<UserGroupResponseDto[]> {

    console.log("groupId : " , groupId)

    // Check if group exists
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    
    console.log("group : " , group)

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    const userGroups = await this.prisma.userGroup.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    console.log("userGroups : " , userGroups)

    return userGroups.map(userGroup => ({
      userId: userGroup.userId,
      groupId: userGroup.groupId,
      role: userGroup.role as UserGroupRole,
      firstName: userGroup.user.firstName,
      lastName: userGroup.user.lastName,
      createdAt: userGroup.createdAt,
      updatedAt: userGroup.updatedAt,
    }));
  }

  async findAllByCourse(courseId: number): Promise<GroupResponseDto[]> {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    return this.prisma.group.findMany({
      where: { 
        courseId,
        active: true // Only return active groups
      },
      orderBy: { name: 'asc' }, // Order groups by name
    });
  }



  async getGroupProgress(groupId: number) {
    // 1. Get group with its course and seances
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        course: {
          include: {
            chapters: true
          }
        },
        seances: {
          where: {
            chapterId: { not: null }, // Only include seances with chapters
            endsAt: { lte: new Date() } // Only include completed seances
          },
          distinct: ['chapterId'], // Count each chapter only once
          select: {
            chapterId: true
          }
        }
      }
    });
  
    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }
    
    if (!group.course) {
      throw new NotFoundException(`Course not found for group with ID ${groupId}`);
    }
  
    const totalChapters = group.course.chapters.length;
    const completedChapters = group.seances.length;
    const progressPercentage = totalChapters > 0 
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0;
  
    return {
      groupId: group.id,
      groupName: group.name,
      courseId: group.courseId,
      courseName: group.course?.name || '',
      totalChapters,
      completedChapters,
      progressPercentage: Math.min(100, progressPercentage), // Cap at 100%
      nextChapter: totalChapters > completedChapters 
        ? group.course.chapters[completedChapters]?.name || null
        : null
    };
  }
}
