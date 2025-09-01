import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;
}
