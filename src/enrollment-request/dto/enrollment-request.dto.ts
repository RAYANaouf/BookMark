import { Type } from "class-transformer";
import { IsNumber } from "class-validator";



export class CreateEnrollmentRequestDto {
    

    @IsNumber()
    @Type(() => Number)
    userId : number;
    

    @IsNumber()
    @Type(() => Number)
    courseId : number;
    
}