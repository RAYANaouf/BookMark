import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEnrollmentRequestDto {
    @IsNumber()
    @Type(() => Number)
    userId: number;
    
    @IsNumber()
    @Type(() => Number)
    groupId: number;
}

export class UpdateEnrollmentRequestDto {
    @IsString()
    status: 'Pending' | 'Approved' | 'Rejected';
    
    @IsString()
    @IsOptional()
    rejectedReason?: string;
}