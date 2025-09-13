import { IsNumber, IsString } from "class-validator";

export class CreateSectionDto {
    @IsString()
    name: string;
    
    @IsNumber()
    order: number;
    
    @IsString()
    description: string;
    
    @IsNumber()
    chapterId: number;
  }