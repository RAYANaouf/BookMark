import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SupportResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the support item',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Title of the support item',
    example: 'Introduction to NestJS'
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Description of the support item',
    example: 'A comprehensive guide to NestJS framework',
    nullable: true
  })
  description?: string | null;

  @ApiProperty({
    description: 'Type of the support item',
    example: 'video',
    enum: ['video', 'document', 'link', 'exercise']
  })
  type: string;

  @ApiPropertyOptional({
    description: 'URL associated with the support item',
    example: 'https://example.com/video',
    nullable: true
  })
  url?: string | null;

  @ApiPropertyOptional({
    description: 'Content of the support item',
    example: 'This is the main content...',
    nullable: true
  })
  content?: string | null;

  @ApiProperty({
    description: 'Whether the support item is published',
    default: false
  })
  isPublished: boolean;

  @ApiProperty({
    description: 'Order of the support item in the section',
    example: 1
  })
  order: number;

  @ApiProperty({
    description: 'ID of the section this support item belongs to',
    example: 1
  })
  sectionId: number;

  @ApiProperty({
    description: 'Date and time when the support item was created',
    example: '2025-09-14T09:19:44.515Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the support item was last updated',
    example: '2025-09-14T09:19:44.515Z'
  })
  updatedAt: Date;
}
