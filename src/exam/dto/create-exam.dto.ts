import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  dateTime: Date;

  @IsInt()
  @Min(1)
  duration: number; // in minutes

  @IsInt()
  @Min(1)
  groupId: number;
}
