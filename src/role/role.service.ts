import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    // Check if role with the same name already exists
    const existingRole = await this.prisma.role.findUnique({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException('Role with this name already exists');
    }

    return this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        description: createRoleDto.description
      },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    // Check if role exists
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Check if new name is already taken by another role
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.prisma.role.findUnique({
        where: { name: updateRoleDto.name },
      });

      if (existingRole) {
        throw new ConflictException('Role with this name already exists');
      }
    }

    return this.prisma.role.update({
      where: { id },
      data: {
        name: updateRoleDto.name,
        description: updateRoleDto.description
      },
    });
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async findAll() {
    return this.prisma.role.findMany();
  }
}
