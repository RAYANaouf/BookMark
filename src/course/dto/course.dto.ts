// src/modules/training-program/dto/create-training-program.dto.ts

import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsNumberString, IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  
  
  @IsNumber()
  @Type(() => Number)
  academyId: number;

  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  targetAudience?: string;

  prerequisites?: string;

  whatYouWillLearn?: string;

  whatYouCanDoAfter?: string;

  minAge : number

  maxAge : number

  price : number

}
