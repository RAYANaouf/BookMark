import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrainingProgramDto } from './dto';

@Injectable()
export class TrainingProgramService {

    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateTrainingProgramDto) {
        return this.prisma.trainingProgram.create({
            data: {
                name: dto.name,
                description: dto.description,
                targetAudience    : dto.forWho,
                prerequisites     : dto.prerequisites,
                whatYouWillLearn  : dto.whatYouWillLearn,
                whatYouCanDoAfter : dto.whatYouCanDoAfter,
                minAge            : dto.minAge,
                maxAge            : dto.maxAge,
            },
        });
    }


}
