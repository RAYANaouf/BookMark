import { IsInt, IsNotEmpty } from 'class-validator';

export class AddTeacherDto {
    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsInt()
    @IsNotEmpty()
    academyId: number;
}
