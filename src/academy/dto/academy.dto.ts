import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"




export class AcademyDto {

    @IsString()
    @IsNotEmpty()
    name : string

    @IsString()
    @IsNotEmpty()
    phone : string

    @IsEmail()
    @IsNotEmpty()
    email : string

    @IsString()
    @IsNotEmpty()
    password : string
}

export class CreateAcademyDto{
    @IsString()
    @IsNotEmpty()
    name : string

    logo? : string
}









//***************************** create academy request DTO *******************************//

export class CreateAcademyRequestDto {
    @ApiProperty({ description: 'Name of the academy' })
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @ApiProperty({ required: false, description: 'Description of the academy' })
    @IsString()
    @IsOptional()
    description?: string;
  
    @ApiProperty({ required: false, description: 'URL to the academy logo' })
    @IsString()
    @IsOptional()
    logo?: string;
  
    @ApiProperty({ required: false, description: 'Contact phone number' })
    @IsString()
    @IsOptional()
    phone?: string;
  
    @ApiProperty({ description: 'Contact email' })
    @IsEmail()
    email: string;
  
    @ApiProperty({ description: 'Street address' })
    @IsString()
    @IsNotEmpty()
    street: string;
  
    @ApiProperty({ description: 'City' })
    @IsString()
    @IsNotEmpty()
    city: string;
  
    @ApiProperty({ required: false, description: 'State/Province' })
    @IsString()
    @IsOptional()
    state?: string;
  
    @ApiProperty({ description: 'Country' })
    @IsString()
    @IsNotEmpty()
    country: string;
  
    @ApiProperty({ required: false, description: 'Postal/ZIP code' })
    @IsString()
    @IsOptional()
    postalCode?: string;
  }


  // Add this after CreateAcademyRequestDto in academy.dto.ts

export class AcademyRequestResponseDto {
    @ApiProperty({ description: 'Request ID' })
    id: number;
  
    @ApiProperty({ description: 'Name of the academy' })
    name: string;
  
    @ApiProperty({ required: false, description: 'Description of the academy' })
    description?: string;
  
    @ApiProperty({ required: false, description: 'URL to the academy logo' })
    logo?: string;
  
    @ApiProperty({ required: false, description: 'Contact phone number' })
    phone?: string;
  
    @ApiProperty({ description: 'Contact email' })
    email: string;
  
    @ApiProperty({ description: 'Request status', enum: ['PENDING', 'APPROVED', 'REJECTED'] })
    status: string;
  
    @ApiProperty({ required: false, description: 'Reason for rejection if applicable' })
    rejectedReason?: string;
  
    @ApiProperty({ description: 'Date when the request was created' })
    createdAt: Date;
  
    @ApiProperty({ description: 'Date when the request was last updated' })
    updatedAt: Date;
  }