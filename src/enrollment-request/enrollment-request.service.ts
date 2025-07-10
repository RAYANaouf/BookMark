import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEnrollmentRequestDto } from './dto';

@Injectable()
export class EnrollmentRequestService {

    constructor(private readonly prisma: PrismaService) {

    }


    create(dto : CreateEnrollmentRequestDto){
        return this.prisma.enrollmentRequest.create({
            data : {
                userId   : dto.userId,
                courseId : dto.courseId
            }
        })
    }

}
