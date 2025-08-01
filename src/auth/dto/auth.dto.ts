import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
        required: true
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'User password',
        minLength: 6,
        example: 'yourSecurePassword123',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class SignUpDto {
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
        required: true
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'User password (min 6 characters)',
        minLength: 6,
        example: 'yourSecurePassword123',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: 'User phone number',
        example: '+1234567890',
        required: false
    })
    @IsString()
    phone?: string;

    @ApiProperty({
        description: 'User first name',
        example: 'Rayan',
        required: false
    })
    @IsString()
    firstName?: string;

    @ApiProperty({
        description: 'User last name',
        example: 'Aouf',
        required: false
    })
    @IsString()
    lastName?: string;

    @ApiProperty({
        description: 'URL to user profile photo',
        example: 'https://example.com/profile.jpg',
        required: false
    })
    profilePhoto?: string;
}

export class CreateSuperAdminDto {
    @ApiProperty({
        description: 'Super admin email address',
        example: 'admin@example.com',
        required: true
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Super admin password (min 6 characters)',
        minLength: 6,
        example: 'adminSecurePassword123',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: 'Super admin first name',
        example: 'Admin',
        required: false
    })
    @IsString()
    firstName?: string;

    @ApiProperty({
        description: 'Super admin last name',
        example: 'User',
        required: false
    })
    @IsString()
    lastName?: string;
}