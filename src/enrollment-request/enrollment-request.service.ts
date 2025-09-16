import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEnrollmentRequestDto, UpdateEnrollmentRequestDto } from './dto';

@Injectable()
export class EnrollmentRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEnrollmentRequestDto) {
    try {
      // Check if request already exists
      const existingRequest = await this.prisma.enrollmentRequest.findUnique({
        where: {
          user_group_request: {
            userId: dto.userId,
            groupId: dto.groupId,
          },
        },
      });

      if (existingRequest) {
        throw new HttpException(
          'Enrollment request already exists',
          HttpStatus.CONFLICT,
        );
      }

      // Check if user is already in the group
      const existingMembership = await this.prisma.userGroup.findUnique({
        where: {
          userId_groupId: {
            userId: dto.userId,
            groupId: dto.groupId,
          },
        },
      });

      if (existingMembership) {
        throw new HttpException(
          'User is already a member of this group',
          HttpStatus.CONFLICT,
        );
      }

      return this.prisma.enrollmentRequest.create({
        data: {
          userId: dto.userId,
          groupId: dto.groupId,
          status: 'Pending',
        },
        include: {
          user: true,
          group: {
            include: {
              course: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            'Enrollment request already exists',
            HttpStatus.CONFLICT,
          );
        }
        if (error.code === 'P2025') {
          throw new HttpException(
            'User or group not found',
            HttpStatus.NOT_FOUND,
          );
        }
      }
      throw error;
    }
  }

  async updateRequest(id: number, dto: UpdateEnrollmentRequestDto) {
    return this.prisma.$transaction(async (prisma) => {
      // 1. Get the request with related data
      const request = await prisma.enrollmentRequest.findUnique({
        where: { id },
        include: {
          user: true,
          group: true,
        },
      });

      if (!request) {
        throw new HttpException(
          'Enrollment request not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (request.status !== 'Pending') {
        throw new HttpException(
          'This request has already been processed',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 2. Update the request status
      const updatedRequest = await prisma.enrollmentRequest.update({
        where: { id },
        data: {
          status: dto.status,
          rejectedReason: dto.rejectedReason,
        },
        include: {
          user: true,
          group: true,
        },
      });

      // 3. If approved, add user to the group
      if (dto.status === 'Approved') {
        await prisma.userGroup.create({
          data: {
            userId: request.userId,
            groupId: request.groupId,
            role: 'STUDENT',
          },
        });
      }

      return updatedRequest;
    });
  }

  async getRequestsForGroup(groupId: number, status?: string) {
    return this.prisma.enrollmentRequest.findMany({
      where: {
        groupId,
        ...(status && { status }),
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getRequestsByUser(userId: number) {
    return this.prisma.enrollmentRequest.findMany({
      where: {
        userId,
      },
      include: {
        group: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteRequest(id: number) {
    return this.prisma.enrollmentRequest.delete({
      where: { id },
    });
  }
}
