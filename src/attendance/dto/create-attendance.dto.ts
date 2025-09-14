import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class CreateAttendanceDto {
  @IsInt()
  seanceId: number;

  @IsInt()
  userId: number;

  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @IsOptional()
  checkinAt?: Date;

  @IsOptional()
  checkoutAt?: Date;

  @IsInt()
  @IsOptional()
  minutesAttended?: number;
}
