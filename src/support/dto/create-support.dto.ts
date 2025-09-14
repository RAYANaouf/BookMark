import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Express } from 'express';
import { Multer } from 'multer';

export class CreateSupportDto {
  @ApiProperty({
    description: 'Title of the support item',
    example: 'Introduction to NestJS'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Description of the support item',
    example: 'A comprehensive guide to NestJS framework',
    nullable: true
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Type of the support item',
    example: 'video',
    enum: ['video', 'document', 'link', 'exercise']
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({
    description: 'URL associated with the support item',
    example: 'https://example.com/video',
    nullable: true
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({
    description: 'Content of the support item',
    example: 'This is the main content...',
    nullable: true
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'File to upload (for document type)',
    type: 'string',
    format: 'binary',
    required: false
  })
  file?: Express.Multer.File;

  @ApiPropertyOptional({
    description: 'Whether the support item is published',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiProperty({
    description: 'Order of the support item in the section',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @ApiProperty({
    description: 'ID of the section this support item belongs to',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  sectionId: number;
}
