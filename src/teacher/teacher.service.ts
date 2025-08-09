import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { AddTeacherDto } from './dto/add-teacher.dto';
import { RemoveTeacherDto } from './dto/remove-teacher.dto';

@Injectable()
export class TeacherService {
    constructor(private prisma: PrismaService) {}

    async getAllTeachers() {
        return this.prisma.user.findMany({
            where: {
                academyLinks: {
                    some: {
                        role: {
                            name: "Teacher"
                        }
                    }
                }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePhoto: true,
                academyLinks: {
                    where: { role: { name: "Teacher" } },
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
                        role: {
                            name: "Teacher"
                        }
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
                        role: {
                            name: "Teacher"
                        } 
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

    async addTeacherToAcademy(dto: AddTeacherDto) {
        // Check if the user exists
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId }
        });
    
        if (!user) {
            throw new ForbiddenException('User not found');
        }
    
        // Check if the academy exists
        const academy = await this.prisma.academy.findUnique({
            where: { id: dto.academyId }
        });
    
        if (!academy) {
            throw new ForbiddenException('Academy not found');
        }
    
        // First, find or create the Teacher role
        const teacherRole = await this.prisma.role.upsert({
            where: { name: "Teacher" },
            update: {}, // if exists, do nothing
            create: { 
                name: "Teacher",
                description: "Teacher role with permissions to teache courses to students"
            }
        });
    
        // Check if the user already has a Teacher role in this academy
        const existingTeacherLink = await this.prisma.userAcademy.findUnique({
            where: {
                userId_academyId_roleId : {
                    userId: dto.userId,
                    academyId: dto.academyId,
                    roleId: teacherRole.id
                }
            }
        });
    
        // If user already has Teacher role, return the existing link
        if (existingTeacherLink) {
            return existingTeacherLink;
        }
    
        // Create a new user-academy link with Teacher role
        return this.prisma.userAcademy.create({
            data: {
                userId: dto.userId,
                academyId: dto.academyId,
                roleId: teacherRole.id
            }
        });
    }

    async removeTeacherFromAcademy(dto: RemoveTeacherDto) {
        // Check if the teacher exists in the academy
        const teacherLink = await this.prisma.userAcademy.findFirst({
            where: {
                userId: dto.userId,
                academyId: dto.academyId,
                role: {
                    name: "Teacher"
                }
            }
        });

        if (!teacherLink) {
            throw new ForbiddenException('Teacher not found in this academy');
        }

        // Delete the teacher role for this user and academy
        return this.prisma.userAcademy.delete({
            where: {
                userId_academyId_roleId : {
                    userId: dto.userId,
                    academyId: dto.academyId,
                    roleId : teacherLink.roleId
                }
            }
        });
    }
}
