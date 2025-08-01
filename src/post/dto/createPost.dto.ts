import { Type } from "class-transformer"
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty({
        description: 'ID of the academy this post belongs to',
        example: 1,
        required: true,
        type: Number
    })
    @IsNumber()
    @Type(() => Number)
    academyId: number;
    
    @ApiProperty({
        description: 'Title of the post',
        example: 'Welcome to Our New Course!',
        required: true,
        maxLength: 200
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'Content of the post (supports markdown)',
        example: 'We are excited to announce our new course on advanced web development...',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    content: string;
}
