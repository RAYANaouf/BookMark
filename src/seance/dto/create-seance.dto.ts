import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateSeanceDto {
  @IsString()
  title: string;
  
  @IsString()
  date: string; // ISO date string

  @IsString()
  startTime: string; // e.g., "14:00"

  @IsString()
  endTime: string; // e.g., "16:00"

  @IsString()
  @IsOptional()
  notes?: string;

  @IsInt()
  groupId: number;

  @IsInt()
  @IsOptional()
  teacherId?: number;

  @IsInt()
  @IsOptional()
  chapterId?: number;
}
