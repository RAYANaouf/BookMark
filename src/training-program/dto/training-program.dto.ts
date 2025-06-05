// src/modules/training-program/dto/create-training-program.dto.ts

import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsNumberString } from 'class-validator';

export class CreateTrainingProgramDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  forWho?: string;

  @IsOptional()
  @IsString()
  prerequisites?: string;

  @IsOptional()
  @IsString()
  whatYouWillLearn?: string;

  @IsOptional()
  @IsString()
  whatYouCanDoAfter?: string;

  @IsOptional()
  @IsNumberString()
  minAge : number

  @IsOptional()
  @IsNumberString()
  maxAge : number
}
