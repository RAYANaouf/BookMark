import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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
    description: 'Whether the support item is published',
    example: true,
    default: false
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean = false;

  @ApiProperty({
    description: 'Order of the support item in the section',
    example: 1
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @ApiProperty({
    description: 'ID of the section this support item belongs to',
    example: 1
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  sectionId: number;

  @ApiPropertyOptional({
    description: 'File to upload (for document type)',
    type: 'string',
    format: 'binary',
    required: false
  })
  @IsOptional()
  file?: Express.Multer.File;
}
