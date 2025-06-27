import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        academy: true,
      },
    });
  }

  async findByAcademy(academyId: number) {
    return this.prisma.post.findMany({
      where: { academyId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(dto: CreatePostDto, logoUrl?: string | null) {
    return this.prisma.post.create({
      data: {
        title       : dto.title,
        description : dto.content,
        photo       : logoUrl ?? null,
        academy     : {
          connect: { id: dto.academyId },
        },
      },
    });
  }
}
