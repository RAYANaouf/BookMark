import { IsInt, Min } from 'class-validator';

export class GetModuleLevelDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsInt()
  @Min(1)
  moduleId: number;
}
