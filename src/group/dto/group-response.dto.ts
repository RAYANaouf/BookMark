import { ApiProperty } from '@nestjs/swagger';

export class GroupResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Group A' })
  name: string;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: 1, required: false })
  courseId?: number | null;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
