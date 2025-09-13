import { ApiProperty } from '@nestjs/swagger';

export class SupportResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string | null;

  @ApiProperty()
  type: string;

  @ApiProperty()
  url: string;

  @ApiProperty({ required: false })
  content?: string | null;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  order: number;

  @ApiProperty()
  sectionId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
