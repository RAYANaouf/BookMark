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
                        connect: { id: dto.academyId }
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

            return this.getCourseWithChapters(course.id);
        });
    }

    private async getCourseWithChapters(courseId: number) {
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
                        isPublished: true,
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

    async getAllCourses(userId : number){

        var result = await this.prisma.course.findMany({
            include : {
                academy : true,
                enrollmentRequests : {
                    where : {
                        userId: userId
                    },
                    select : {
                        status : true
                    }
                }
            }
        })

        const retrun_result = result.map(course => ({
            ...course,
            requestState : course.enrollmentRequests[0]?.status ??  ""
        }))

        return retrun_result
    }
}
