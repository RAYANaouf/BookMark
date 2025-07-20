import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEnrollmentRequestDto } from './dto';

@Injectable()
export class EnrollmentRequestService {

    constructor(private readonly prisma: PrismaService) {

    }


    create(dto: CreateEnrollmentRequestDto) {
        return this.prisma.enrollmentRequest.create({
            data: {
                userId: dto.userId,
                courseId: dto.courseId
            }
        });
    }

    async acceptRequest(id: number) {
        // Start a transaction to ensure data consistency
        return this.prisma.$transaction(async (prisma) => {
            // 1. Get the request with related data
            const request = await prisma.enrollmentRequest.findUnique({
                where: { id },
                include: {
                    user: true,
                    courses: {
                        include: {
                            groups: true
                        }
                    }
                }
            });

            if (!request) {
                throw new Error('Enrollment request not found');
            }

            if (request.status !== 'Pending') {
                throw new Error('This request has already been processed');
            }

            // 2. Update the request status to 'Approved'
            const updatedRequest = await prisma.enrollmentRequest.update({
                where: { id },
                data: { status: 'Approved' },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true
                        }
                    },
                    courses: {
                        select: {
                            id: true,
                            name: true,
                            academy: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            });

            return {
                id: updatedRequest.id,
                status: updatedRequest.status,
                createdAt: updatedRequest.createdAt,
                updatedAt: updatedRequest.updatedAt,
                user: updatedRequest.user,
                course: updatedRequest.courses
            };
        });
    }

}
