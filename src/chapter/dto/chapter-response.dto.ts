import { ApiProperty } from '@nestjs/swagger';

export class ChapterResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Introduction' })
  name: string;

  @ApiProperty({ example: 'Course introduction', required: false, nullable: true })
  description?: string | null;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty({ example: false })
  isPublished: boolean;

  @ApiProperty({ example: 1 })
  courseId: number;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
