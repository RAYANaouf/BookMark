import { Body, Controller, Post } from '@nestjs/common';
import { EnrollmentRequestService } from './enrollment-request.service';
import { CreateEnrollmentRequestDto } from './dto';

@Controller('enrollment-request')
export class EnrollmentRequestController {

    constructor(private readonly EnrollmentRequestService : EnrollmentRequestService){

    }


    @Post('create')
    async create(@Body() dto: CreateEnrollmentRequestDto) {
        return this.EnrollmentRequestService.create(dto);
    }
}
