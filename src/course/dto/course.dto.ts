// src/modules/training-program/dto/create-training-program.dto.ts

import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsNumberString, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { CreateChapterDto } from './create-chapter.dto';

export class CreateCourseDto {
  
  @IsNumber()
  @Type(() => Number)
  academyId: number;

  @IsNumber()
  @Type(() => Number)
  moduleId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  targetAudience?: string;

  @IsString()
  @IsOptional()
  prerequisites?: string;

  @IsString()
  @IsOptional()
  whatYouWillLearn?: string;

  @IsString()
  @IsOptional()
  whatYouCanDoAfter?: string;

  @IsNumber()
  @IsOptional()
  minAge?: number;

  @IsNumber()
  @IsOptional()
  maxAge?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChapterDto)
  @IsOptional()  // Add this decorator
  chapters?: CreateChapterDto[];  // Make it optional with ?
}
