import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsUrl } from 'class-validator';

export class CreateSupportDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  type: string; // 'video', 'document', 'link', 'exercise', etc.

  @IsString()
  @IsUrl()
  url?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsNumber()
  @IsNotEmpty()
  order: number;

  @IsNumber()
  @IsNotEmpty()
  sectionId: number;
}
