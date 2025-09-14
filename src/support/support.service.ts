import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { SupportResponseDto } from './dto/support-response.dto';
import * as firebaseAdmin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async create(createSupportDto: CreateSupportDto , fileUrl?: string): Promise<SupportResponseDto> {
    // Check if section exists
    const section = await this.prisma.section.findUnique({
      where: { id: createSupportDto.sectionId },
    });

    if (!section) {
      throw new NotFoundException(
        `Section with ID ${createSupportDto.sectionId} not found`,
      );
    }

    // Check for duplicate order in the same section
    const existingSupport = await this.prisma.support.findFirst({
      where: {
        sectionId: createSupportDto.sectionId,
        order: createSupportDto.order,
      },
    });

    if (existingSupport) {
      throw new ConflictException(
        `A support with order ${createSupportDto.order} already exists in section ${createSupportDto.sectionId}`,
      );
    }

    return this.prisma.support.create({
      data: {
        title: createSupportDto.title,
        description: createSupportDto.description,
        type: createSupportDto.type,
        url: fileUrl || "",
        content: createSupportDto.content,
        isPublished: createSupportDto.isPublished ?? false,
        order: createSupportDto.order,
        sectionId: createSupportDto.sectionId,
      },
    });
  }

  async findAllBySectionId(sectionId: number): Promise<SupportResponseDto[]> {
    // Check if section exists
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
    });

    if (!section) {
      throw new NotFoundException(`Section with ID ${sectionId} not found`);
    }

    return this.prisma.support.findMany({
      where: { sectionId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number): Promise<SupportResponseDto> {
    const support = await this.prisma.support.findUnique({
      where: { id },
    });

    if (!support) {
      throw new NotFoundException(`Support with ID ${id} not found`);
    }

    return support;
  }

  async update(
    id: number,
    updateSupportDto: UpdateSupportDto,
  ): Promise<SupportResponseDto> {
    // Check if support exists
    const existingSupport = await this.prisma.support.findUnique({
      where: { id },
    });

    if (!existingSupport) {
      throw new NotFoundException(`Support with ID ${id} not found`);
    }

    // If order is being updated, check for conflicts
    if (updateSupportDto.order !== undefined && 
        updateSupportDto.order !== existingSupport.order) {
      const conflict = await this.prisma.support.findFirst({
        where: {
          sectionId: updateSupportDto.sectionId ?? existingSupport.sectionId,
          order: updateSupportDto.order,
          id: { not: id },
        },
      });

      if (conflict) {
        throw new ConflictException(
          `A support with order ${updateSupportDto.order} already exists in this section`,
        );
      }
    }

    return this.prisma.support.update({
      where: { id },
      data: updateSupportDto,
    });
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.support.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Support with ID ${id} not found`);
      }
      throw error;
    }
  }
}
