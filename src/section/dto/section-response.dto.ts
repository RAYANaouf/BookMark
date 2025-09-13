export class SectionResponseDto {
  id: number;
  name: string;
  description: string | null;  // Allow null
  order: number;
  chapterId: number;
  createdAt: Date;
  updatedAt: Date;
}