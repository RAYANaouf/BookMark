import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { ChapterResponseDto } from './dto/chapter-response.dto';

@Injectable()
export class ChapterService {
  constructor(private prisma: PrismaService) {}

  async create(createChapterDto: CreateChapterDto): Promise<ChapterResponseDto> {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: createChapterDto.courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${createChapterDto.courseId} not found`);
    }

    return this.prisma.chapter.create({
      data: {
        name : createChapterDto.name,
        description: createChapterDto.description,
        order: createChapterDto.order,
        courseId: createChapterDto.courseId,
      },
    });
  }

  async findAllByCourse(courseId: number): Promise<ChapterResponseDto[]> {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    return this.prisma.chapter.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number): Promise<ChapterResponseDto> {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id },
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }

    return chapter;
  }

  async update(id: number, updateChapterDto: UpdateChapterDto): Promise<ChapterResponseDto> {
    // Check if chapter exists
    const existingChapter = await this.prisma.chapter.findUnique({
      where: { id },
    });

    if (!existingChapter) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }

    // If courseId is being updated, check if the new course exists
    if (updateChapterDto.courseId && updateChapterDto.courseId !== existingChapter.courseId) {
      const course = await this.prisma.course.findUnique({
        where: { id: updateChapterDto.courseId },
      });

      if (!course) {
        throw new NotFoundException(`Course with ID ${updateChapterDto.courseId} not found`);
      }
    }

    return this.prisma.chapter.update({
      where: { id },
      data: {
        name: updateChapterDto.name,
        description: updateChapterDto.description,
        order: updateChapterDto.order,
        courseId: updateChapterDto.courseId,
      },
    });
  }

  async remove(id: number): Promise<void> {
    // Check if chapter exists
    const chapter = await this.prisma.chapter.findUnique({
      where: { id },
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }

    await this.prisma.chapter.delete({
      where: { id },
    });
  }
}
