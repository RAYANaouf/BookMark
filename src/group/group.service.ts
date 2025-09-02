import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupResponseDto } from './dto/group-response.dto';

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
}
