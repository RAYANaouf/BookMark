import { Controller, Post, Body, UseGuards, Patch, Param, ParseIntPipe, Get, Query } from '@nestjs/common';
import { EnrollmentRequestService } from './enrollment-request.service';
import { CreateEnrollmentRequestDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('enrollment-request')
export class EnrollmentRequestController {
    constructor(private readonly enrollmentRequestService: EnrollmentRequestService) {}

    @Post('create')
    @ApiBody({
        schema : {
            type : 'object',
            properties : {
                userId : { type : 'number' },
                groupId : { type : 'number' }
            }
        }
    })
    async create(@Body() dto: CreateEnrollmentRequestDto) {
        return this.enrollmentRequestService.create(dto);
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtGuard)
    @Get('user/:userId')
    async getByUserId(@Param('userId', ParseIntPipe) userId: number) {
        return this.enrollmentRequestService.getRequestsByUser(userId);
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtGuard)
    @Get('group/:groupId')
    @ApiResponse({ status: 200, description: 'Returns enrollment requests for the specified group' })
    async getByGroupId(
        @Param('groupId', ParseIntPipe) groupId: number
    ) {
        return this.enrollmentRequestService.getRequestsForGroup(groupId);
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtGuard)
    @Patch(':id/accept')
    async acceptRequest(@Param('id', ParseIntPipe) id: number) {
        return this.enrollmentRequestService.updateRequest(id,{status:'Approved'});
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtGuard)
    @Patch(':id/reject')
    async rejectRequest(@Param('id', ParseIntPipe) id: number) {
        return this.enrollmentRequestService.updateRequest(id,{status:'Rejected'});
    }
}
