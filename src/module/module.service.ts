import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModuleService {
  constructor(private prisma: PrismaService) {}

  async create(createModuleDto: CreateModuleDto) {
    // Check if module with the same name already exists
    const existingModule = await this.prisma.module.findUnique({
      where: { name: createModuleDto.name },
    });

    if (existingModule) {
      throw new ConflictException('Module with this name already exists');
    }

    return this.prisma.module.create({
      data: {
        name: createModuleDto.name,
      },
    });
  }

  async update(id: number, updateModuleDto: UpdateModuleDto) {
    // Check if module exists
    const module = await this.prisma.module.findUnique({
      where: { id },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    // Check if new name is already taken by another module
    if (updateModuleDto.name && updateModuleDto.name !== module.name) {
      const existingModule = await this.prisma.module.findUnique({
        where: { name: updateModuleDto.name },
      });

      if (existingModule) {
        throw new ConflictException('Module with this name already exists');
      }
    }

    return this.prisma.module.update({
      where: { id },
      data: {
        name: updateModuleDto.name,
      },
    });
  }

  async findOne(id: number) {
    const module = await this.prisma.module.findUnique({
      where: { id },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return module;
  }

  async findAll() {
    return this.prisma.module.findMany();
  }

  async remove(id: number) {
    // Check if module exists
    const module = await this.prisma.module.findUnique({
      where: { id },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    // Check if module is being used anywhere before deletion
    // Add any necessary checks here based on your requirements

    // Delete the module
    const deletedModule = await this.prisma.module.delete({
      where: { id },
    });

    return {
      message: 'Module deleted successfully',
      deletedModule,
    };
  }
}
