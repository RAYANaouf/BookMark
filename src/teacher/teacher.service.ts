import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeacherService {
    constructor(private prisma: PrismaService) {}

    async getAllTeachers() {
        return this.prisma.user.findMany({
            where: {
                academyLinks: {
                    some: {
                        role: 'Teacher'
                    }
                }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePhoto: true,
                academyLinks: {
                    where: { role: 'Teacher' },
                    select: {
                        academy: {
                            select: {
                                id: true,
                                name: true,
                                logo: true
                            }
                        }
                    }
                }
            }
        });
    }

    async getTeachersByAcademy(academyId: number) {
        return this.prisma.user.findMany({
            where: {
                academyLinks: {
                    some: {
                        academyId,
                        role: 'Teacher'
                    }
                }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePhoto: true,
                academyLinks: {
                    where: { 
                        academyId,
                        role: 'Teacher' 
                    },
                    select: {
                        role: true,
                        academy: {
                            select: {
                                id: true,
                                name: true,
                                logo: true
                            }
                        }
                    }
                }
            }
        });
    }
}
