import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionResponseDto } from './dto/section-response.dto';

@Injectable()
export class SectionService {
  constructor(private prisma: PrismaService) {}

  async create(createSectionDto: CreateSectionDto): Promise<SectionResponseDto> {
    // Check if chapter exists
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: createSectionDto.chapterId },
    });

    if (!chapter) {
      throw new NotFoundException(
        `Chapter with ID ${createSectionDto.chapterId} not found`,
      );
    }

    return this.prisma.section.create({
      data: {
        name: createSectionDto.name,
        order: createSectionDto.order,
        description: createSectionDto.description || '', // Use description as content or empty string
        chapterId: createSectionDto.chapterId,
      },
    });
  }

  async findAllByChapter(chapterId: number): Promise<SectionResponseDto[]> {
    // Check if chapter exists
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${chapterId} not found`);
    }

    return this.prisma.section.findMany({
      where: { chapterId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number): Promise<SectionResponseDto> {
    const section = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    return section;
  }

  async update(
    id: number,
    updateSectionDto: UpdateSectionDto,
  ): Promise<SectionResponseDto> {
    // Check if section exists
    const section = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    // If chapterId is being updated, check if the new chapter exists
    if (updateSectionDto.chapterId) {
      const chapter = await this.prisma.chapter.findUnique({
        where: { id: updateSectionDto.chapterId },
      });

      if (!chapter) {
        throw new NotFoundException(
          `Chapter with ID ${updateSectionDto.chapterId} not found`,
        );
      }
    }

    return this.prisma.section.update({
      where: { id },
      data: updateSectionDto,
    });
  }

  async remove(id: number): Promise<void> {
    // Check if section exists
    const section = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    await this.prisma.section.delete({
      where: { id },
    });
  }
}
