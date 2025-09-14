import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { SupportResponseDto } from './dto/support-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('supports')
@Controller('supports')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new support item' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The support item has been successfully created.',
    type: SupportResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Section not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A support with the same order already exists in this section',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string', nullable: true },
        type: { type: 'string', enum: ['document', 'video', 'link', 'exercise'] },
        url: { type: 'string', nullable: true },
        content: { type: 'string', nullable: true },
        isPublished: { type: 'boolean', default: false },
        order: { type: 'number' },
        sectionId: { type: 'number' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload (for document type)'
        }
      },
      required: ['title', 'type', 'order', 'sectionId']
    }
  })
  create(
    @Body() createSupportDto: CreateSupportDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<SupportResponseDto> {
    return this.supportService.create(createSupportDto, file);
  }

  @Get('section/:sectionId')
  @ApiOperation({ summary: 'Get all support items for a section' })
  @ApiParam({ 
    name: 'sectionId', 
    type: 'number',
    description: 'ID of the section' 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all support items for the section',
    type: [SupportResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Section not found',
  })
  findAllBySectionId(
    @Param('sectionId', ParseIntPipe) sectionId: number,
  ): Promise<SupportResponseDto[]> {
    return this.supportService.findAllBySectionId(sectionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a support item by ID' })
  @ApiParam({ 
    name: 'id', 
    type: 'number',
    description: 'Support item ID' 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the support item',
    type: SupportResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Support item not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SupportResponseDto> {
    return this.supportService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a support item' })
  @ApiParam({ 
    name: 'id', 
    type: 'number',
    description: 'Support item ID' 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The support item has been updated',
    type: SupportResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Support item not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A support with the same order already exists in this section',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupportDto: UpdateSupportDto,
  ): Promise<SupportResponseDto> {
    return this.supportService.update(id, updateSupportDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a support item' })
  @ApiParam({ 
    name: 'id', 
    type: 'number',
    description: 'Support item ID' 
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The support item has been deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Support item not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.supportService.remove(id);
  }
}
