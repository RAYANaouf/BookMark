import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  order: number;

  @IsNumber()
  courseId: number;
}
