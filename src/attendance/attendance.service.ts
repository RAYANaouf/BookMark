import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    try {
      const { seanceId, userId, ...attendanceData } = createAttendanceDto;
      
      // Check if seance exists
      const seance = await this.prisma.seance.findUnique({
        where: { id: seanceId },
      });
      if (!seance) {
        throw new NotFoundException(`Seance with ID ${seanceId} not found`);
      }

      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Create attendance record
      return await this.prisma.attendance.create({
        data: {
          seanceId,
          userId,
          status: AttendanceStatus.PRESENT, // Default status
          ...attendanceData,
        },
        include: {
          seance: true,
          user: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Error creating attendance record',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return await this.prisma.attendance.findMany({
      include: {
        seance: true,
        user: true,
      },
    });
  }

  async findOne(seanceId: number, userId: number) {
    const attendance = await this.prisma.attendance.findUnique({
      where: {
        seanceId_userId: {
          seanceId,
          userId,
        },
      },
      include: {
        seance: true,
        user: true,
      },
    });

    if (!attendance) {
      throw new NotFoundException(
        `Attendance record not found for seance ${seanceId} and user ${userId}`,
      );
    }

    return attendance;
  }

  async update(
    seanceId: number,
    userId: number,
    updateAttendanceDto: UpdateAttendanceDto,
  ) {
    try {
      return await this.prisma.attendance.update({
        where: {
          seanceId_userId: {
            seanceId,
            userId,
          },
        },
        data: updateAttendanceDto,
        include: {
          seance: true,
          user: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Attendance record not found for seance ${seanceId} and user ${userId}`,
        );
      }
      throw error;
    }
  }

  async remove(seanceId: number, userId: number) {
    try {
      return await this.prisma.attendance.delete({
        where: {
          seanceId_userId: {
            seanceId,
            userId,
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Attendance record not found for seance ${seanceId} and user ${userId}`,
        );
      }
      throw error;
    }
  }

  async getSeanceAttendances(seanceId: number) {
    // Check if seance exists
    const seance = await this.prisma.seance.findUnique({
      where: { id: seanceId },
    });
    if (!seance) {
      throw new NotFoundException(`Seance with ID ${seanceId} not found`);
    }

    return this.prisma.attendance.findMany({
      where: { seanceId },
      include: {
        user: true,
      },
    });
  }

  async getUserAttendances(userId: number) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.attendance.findMany({
      where: { userId },
      include: {
        seance: {
          include: {
            group: true,
            chapter: true,
          },
        },
      },
      orderBy: {
        seance: {
          startsAt: 'desc',
        },
      },
    });
  }
}
