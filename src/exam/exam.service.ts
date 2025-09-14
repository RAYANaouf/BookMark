import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async create(createExamDto: CreateExamDto) {
    try {
      // Check if group exists
      const group = await this.prisma.group.findUnique({
        where: { id: createExamDto.groupId },
      });

      if (!group) {
        throw new NotFoundException(`Group with ID ${createExamDto.groupId} not found`);
      }

      return await this.prisma.exam.create({
        data: {
          name: createExamDto.name,
          dateTime: createExamDto.dateTime,
          duration: createExamDto.duration,
          groupId: createExamDto.groupId,
        },
        include: {
          group: true,
          grade: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Error creating exam',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return this.prisma.exam.findMany({
      include: {
        group: true,
        grade: true,
      },
      orderBy: {
        dateTime: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        group: true,
        grade: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    try {
      // Check if exam exists
      const existingExam = await this.prisma.exam.findUnique({
        where: { id },
      });

      if (!existingExam) {
        throw new NotFoundException(`Exam with ID ${id} not found`);
      }

      // Check if group exists if groupId is being updated
      if (updateExamDto.groupId) {
        const group = await this.prisma.group.findUnique({
          where: { id: updateExamDto.groupId },
        });

        if (!group) {
          throw new NotFoundException(`Group with ID ${updateExamDto.groupId} not found`);
        }
      }

      return await this.prisma.exam.update({
        where: { id },
        data: updateExamDto,
        include: {
          group: true,
          grade: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Exam with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      // Delete all grades associated with this exam first
      await this.prisma.examGrad.deleteMany({
        where: { examId: id },
      });

      // Then delete the exam
      return await this.prisma.exam.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Exam with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getGroupExams(groupId: number) {
    // Check if group exists
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    return this.prisma.exam.findMany({
      where: { groupId },
      include: {
        grade: true,
      },
      orderBy: {
        dateTime: 'desc',
      },
    });
  }

  async updateGrade(examId: number, userId: number, updateGradeDto: UpdateGradeDto) {
    try {
      // Check if exam exists
      const exam = await this.prisma.exam.findUnique({
        where: { id: examId },
      });

      if (!exam) {
        throw new NotFoundException(`Exam with ID ${examId} not found`);
      }

      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Check if grade exists, if not create it
      const existingGrade = await this.prisma.examGrad.findFirst({
        where: {
          examId,
          userId,
        },
      });

      if (existingGrade) {
        // Update existing grade
        return await this.prisma.examGrad.update({
          where: {
            id: existingGrade.id,
          },
          data: {
            grade: updateGradeDto.grade,
          },
          include: {
            user: true,
            exam: true,
          },
        });
      } else {
        // Create new grade
        return await this.prisma.examGrad.create({
          data: {
            examId,
            userId,
            grade: updateGradeDto.grade,
          },
          include: {
            user: true,
            exam: true,
          },
        });
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Error updating grade',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserGrades(userId: number) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.examGrad.findMany({
      where: { userId },
      include: {
        exam: {
          include: {
            group: true,
          },
        },
      },
      orderBy: {
        exam: {
          dateTime: 'desc',
        },
      },
    });
  }
}
