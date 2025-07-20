import { IsInt, IsNotEmpty } from 'class-validator';

export class RemoveTeacherDto {
    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsInt()
    @IsNotEmpty()
    academyId: number;
}
