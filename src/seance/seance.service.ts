import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSeanceDto } from './dto/create-seance.dto';
import { UpdateSeanceDto } from './dto/update-seance.dto';

@Injectable()
export class SeanceService {
  constructor(private prisma: PrismaService) {}

  async create(createSeanceDto: CreateSeanceDto) {
    try {
      const { date, startTime, endTime, ...rest } = createSeanceDto;
      
      // Combine date and time into DateTime objects
      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${endTime}`);

      const seance = await this.prisma.seance.create({
        data: {
          ...rest,
          startsAt: startDateTime,
          endsAt: endDateTime,
        },
        include: {
          group: true,
          teacher: true,
          chapter: true,
        },
      });

      return seance;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create seance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return this.prisma.seance.findMany({
      include: {
        group: true,
        teacher: true,
        chapter: true,
      },
      orderBy: {
        startsAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const seance = await this.prisma.seance.findUnique({
      where: { id },
      include: {
        group: true,
        teacher: true,
        chapter: true,
        attendance: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!seance) {
      throw new NotFoundException(`Seance with ID ${id} not found`);
    }

    return seance;
  }

  async update(id: number, updateSeanceDto: UpdateSeanceDto) {
    try {
      const { date, startTime, endTime, ...rest } = updateSeanceDto;
      const data: any = { ...rest };

      // Only update date/time if provided
      if (date && startTime) {
        data.startTime = new Date(`${date}T${startTime}`);
      }
      if (date && endTime) {
        data.endTime = new Date(`${date}T${endTime}`);
      }

      return await this.prisma.seance.update({
        where: { id },
        data,
        include: {
          group: true,
          teacher: true,
          chapter: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Seance with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.seance.delete({
        where: { id },
      });
      return { message: 'Seance deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Seance with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getSeancesByGroup(groupId: number) {
    return this.prisma.seance.findMany({
      where: { groupId },
      include: {
        teacher: true,
        chapter: true,
      },
      orderBy: {
        startsAt: 'desc',
      },
    });
  }

  async getSeancesByTeacher(teacherId: number) {
    return this.prisma.seance.findMany({
      where: { teacherId },
      include: {
        group: true,
        chapter: true,
      },
      orderBy: {
        startsAt: 'desc',
      },
    });
  }
}
