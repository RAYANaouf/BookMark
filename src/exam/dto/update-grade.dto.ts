import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateGradeDto {
  @IsNumber()
  @Min(0)
  @Max(20) // Assuming a 0-20 grading scale, adjust as needed
  grade: number;
}
