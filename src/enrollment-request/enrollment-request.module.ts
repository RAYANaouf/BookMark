import { Module } from '@nestjs/common';
import { EnrollmentRequestController } from './enrollment-request.controller';
import { EnrollmentRequestService } from './enrollment-request.service';

@Module({
  controllers: [EnrollmentRequestController],
  providers: [EnrollmentRequestService]
})
export class EnrollmentRequestModule {


  
}
