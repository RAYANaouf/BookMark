import { IsNumber, IsString, IsOptional, IsEmail } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({
        description: 'The unique identifier of the user',
        example: 1,
        type: Number
    })
    @IsNumber()
    id: number;
    
    @ApiPropertyOptional({
        description: 'User\'s phone number',
        example: '+1234567890',
        nullable: true
    })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({
        description: 'User\'s first name',
        example: 'John',
        nullable: true
    })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiPropertyOptional({
        description: 'User\'s last name',
        example: 'Doe',
        nullable: true
    })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiPropertyOptional({
        description: 'URL to the user\'s profile photo',
        example: 'https://storage.googleapis.com/...',
        nullable: true
    })
    @IsString()
    @IsOptional()
    profilePhoto?: string;

    @ApiPropertyOptional({
        description: 'User\'s email address',
        example: 'user@example.com',
        nullable: true
    })
    @IsEmail()
    @IsOptional()
    email?: string;
}
