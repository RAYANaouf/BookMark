import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class CourseService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateCourseDto, coverPhotoUrl?: string) {
        return this.prisma.$transaction(async (prisma) => {
            // Create the course
            const course = await prisma.course.create({
                data: {
                    name: dto.name,
                    description: dto.description,
                    targetAudience: dto.targetAudience,
                    prerequisites: dto.prerequisites,
                    whatYouWillLearn: dto.whatYouWillLearn,
                    whatYouCanDoAfter: dto.whatYouCanDoAfter,
                    minAge: dto.minAge,
                    maxAge: dto.maxAge,
                    price : dto.price,
                    coverPhoto: coverPhotoUrl,
                    module: {
                        connect: { id: dto.moduleId }
                    },
                    academy: {
                        connect: { id: dto.academyId }
                    },
                },
            });

            // Create chapters if they exist
            if (dto.chapters && dto.chapters.length > 0) {
                await Promise.all(dto.chapters.map(chapter => 
                    prisma.chapter.create({
                        data: {
                            name: chapter.name,
                            description: chapter.description,
                            order: chapter.order,
                            course: {
                                connect: { id: course.id }
                            }
                        }
                    })
                ));
            }

            return this.getCourseDetails(course.id);
        });
    }

    async getCourseDetails(courseId: number) {
        return this.prisma.course.findUnique({
            where: { id: courseId },
            include: {
                chapters: {
                    orderBy: { order: 'asc' },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        order: true,
                        createdAt: true,
                        updatedAt: true
                    }
                },
                academy: true,
                module: true
            }
        });
    }

    async findByAcademy(academyId: number) {
        var result = this.prisma.course.findMany({
            where : {academyId}
        }) 
        console.log(" get course  by academy : " , result)
        return result
    }

    async getAll(){
        var result = await this.prisma.course.findMany({
            include : {
                academy : true
            }
        })
        return result
    }

    async getAllCourses(userId: number) {
        // Get all courses with their groups and user's enrollment status
        const courses = await this.prisma.course.findMany({
            include: {
                academy: true,
                groups: {
                    include: {
                        userGroups: {
                            where: {
                                userId: userId
                            },
                            select: {
                                role: true
                            }
                        },
                        enrollmentRequests: {
                            where: {
                                userId: userId,
                                status: 'Pending'
                            },
                            select: {
                                id: true
                            }
                        }
                    }
                }
            }
        });

        // Transform the data to include enrollment status
        return courses.map(course => ({
            ...course,
            enrollmentStatus: this.getUserEnrollmentStatus(course.groups, userId)
        }));
    }

    private getUserEnrollmentStatus(groups: any[], userId: number): string {
        // Check if user is enrolled in any group
        const isEnrolled = groups.some(group => 
            group.userGroups.some((ug: any) => ug.userId === userId)
        );
        
        if (isEnrolled) return 'Enrolled';

        // Check if user has a pending request for any group
        const hasPendingRequest = groups.some(group =>
            group.enrollmentRequests.some((er: any) => er.userId === userId)
        );

        return hasPendingRequest ? 'Pending' : 'Not Enrolled';
    }

    async deleteCourse(courseId: number): Promise<void> {
        // First, check if the course exists
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: {
                chapters: {
                    include: {
                        sections: true,
                        seances: {
                            include: {
                                attendance: true
                            }
                        }
                    }
                },
                groups: {
                    include: {
                        exams: {
                            include: {
                                grades: true
                            }
                        }
                    }
                }
            }
        });

        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }

        // Use a transaction to ensure all deletes succeed or fail together
        await this.prisma.$transaction(async (prisma) => {
            // 1. First, delete all attendance records for seances in this course
            await prisma.attendance.deleteMany({
                where: {
                    seance: {
                        chapter: {
                            courseId: courseId
                        }
                    }
                }
            });

            // 2. Delete exam grades for exams in this course's groups
            await prisma.examGrad.deleteMany({
                where: {
                    exam: {
                        group: {
                            courseId: courseId
                        }
                    }
                }
            });

            // 3. Delete exams in this course's groups
            await prisma.exam.deleteMany({
                where: {
                    group: {
                        courseId: courseId
                    }
                }
            });

            // 4. Delete supports from sections
            await prisma.support.deleteMany({
                where: {
                    section: {
                        chapter: {
                            courseId: courseId
                        }
                    }
                }
            });

            // 5. Delete sections from chapters
            await prisma.section.deleteMany({
                where: {
                    chapter: {
                        courseId: courseId
                    }
                }
            });

            // 6. Now it's safe to delete seances
            await prisma.seance.deleteMany({
                where: {
                    chapter: {
                        courseId: courseId
                    }
                }
            });

            // 7. Delete chapters
            await prisma.chapter.deleteMany({
                where: { courseId: courseId }
            });

            // 8. Delete enrollment requests for groups in this course
            await prisma.enrollmentRequest.deleteMany({
                where: {
                    group: {
                        courseId: courseId
                    }
                }
            });

            // 9. Delete user groups for groups in this course
            await prisma.userGroup.deleteMany({
                where: {
                    group: {
                        courseId: courseId
                    }
                }
            });

            // 10. Delete groups
            await prisma.group.deleteMany({
                where: { courseId: courseId }
            });

            // 11. Finally, delete the course
            await prisma.course.delete({
                where: { id: courseId }
            });
        });
    }
}
