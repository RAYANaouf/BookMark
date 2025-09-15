import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto';

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
}
