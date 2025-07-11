import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto';

@Injectable()
export class CourseService {

    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateCourseDto , coverPhotoUrl? : string) {
        return this.prisma.course.create({
            data: {
                name: dto.name,
                description: dto.description,
                targetAudience    : dto.targetAudience,
                prerequisites     : dto.prerequisites,
                whatYouWillLearn  : dto.whatYouWillLearn,
                whatYouCanDoAfter : dto.whatYouCanDoAfter,
                minAge            : dto.minAge,
                maxAge            : dto.maxAge,
                coverPhoto        : coverPhotoUrl,
                academy: {
                  connect: { id: dto.academyId } 
                }
            },
        });
    }

    async findByAcademy(academyId : number){
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

        
        console.log("the result log  ===> " , result)

        const retrun_result = result.map(course => ({
            ...course,
            requestState : course.enrollmentRequests[0]?.status ??  ""
        }))
        console.log("we just debug first ===> " , retrun_result)

        return retrun_result
    }


}
