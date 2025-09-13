import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionResponseDto } from './dto/section-response.dto';

@ApiTags('sections')
@Controller('sections')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new section' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The section has been successfully created.',
    type: SectionResponseDto,
  })
  @ApiBody({
    type: CreateSectionDto,
    schema: {
      example: {
        name: 'Introduction',
        content: 'This is the introduction section',
        order: 1,
        chapterId: 1,
      },
    },
  })
  create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionService.create(createSectionDto);
  }

  @Get('chapter/:chapterId')
  @ApiOperation({ summary: 'Get all sections for a chapter' })
  @ApiParam({
    name: 'chapterId',
    description: 'ID of the chapter to get sections for',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all sections for the specified chapter',
    type: [SectionResponseDto],
  })
  findAllByChapter(@Param('chapterId', ParseIntPipe) chapterId: number) {
    return this.sectionService.findAllByChapter(chapterId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a section by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the section to retrieve',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the requested section',
    type: SectionResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sectionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a section' })
  @ApiParam({
    name: 'id',
    description: 'ID of the section to update',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The section has been successfully updated.',
    type: SectionResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    return this.sectionService.update(id, updateSectionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a section' })
  @ApiParam({
    name: 'id',
    description: 'ID of the section to delete',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The section has been successfully deleted.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sectionService.remove(id);
  }
}
