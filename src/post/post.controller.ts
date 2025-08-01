import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import * as firebaseAdmin from 'firebase-admin';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ 
        summary: 'Get all posts',
        description: 'Retrieves a list of all posts across all academies.'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved all posts',
        schema: {
            example: [
                {
                    id: 1,
                    title: 'Welcome to Our Academy',
                    content: 'We are excited to have you here...',
                    photoUrl: 'https://storage.googleapis.com/...',
                    academyId: 1,
                    createdAt: '2025-01-01T00:00:00.000Z',
                    updatedAt: '2025-01-01T00:00:00.000Z'
                }
            ]
        }
    })
    getAll() {
        return this.postService.getAll();
    }

    @Get('academy/:academyId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ 
        summary: 'Get posts by academy',
        description: 'Retrieves all posts for a specific academy.'
    })
    @ApiParam({
        name: 'academyId',
        required: true,
        description: 'ID of the academy',
        example: 1
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved posts for the academy',
        schema: {
            example: [
                {
                    id: 1,
                    title: 'Welcome to Our Academy',
                    content: 'We are excited to have you here...',
                    photoUrl: 'https://storage.googleapis.com/...',
                    academyId: 1,
                    createdAt: '2025-01-01T00:00:00.000Z',
                    updatedAt: '2025-01-01T00:00:00.000Z'
                }
            ]
        }
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Academy not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Academy not found',
                error: 'Not Found'
            }
        }
    })
    getByAcademy(@Param('academyId') academyId: string) {
        return this.postService.findByAcademy(Number(academyId));
    }

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(
        FileInterceptor("photo", {
            storage: memoryStorage(),
            limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
        })
    )
    @ApiOperation({ 
        summary: 'Create a new post',
        description: 'Creates a new post with optional photo. Requires authentication.'
    })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Post creation data',
        required: true,
        schema: {
            type: 'object',
            required: ['academyId', 'title', 'content'],
            properties: {
                academyId: { 
                    type: 'number',
                    example: 1,
                    description: 'ID of the academy this post belongs to'
                },
                title: { 
                    type: 'string',
                    example: 'Welcome to Our New Course!',
                    description: 'Title of the post (max 200 chars)'
                },
                content: { 
                    type: 'string',
                    example: 'We are excited to announce...',
                    description: 'Content of the post (supports markdown)'
                },
                photo: {
                    type: 'string',
                    format: 'binary',
                    description: 'Optional cover photo for the post (max 5MB, jpg/jpeg/png)'
                }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Post created successfully',
        schema: {
            example: {
                id: 1,
                title: 'Welcome to Our New Course!',
                content: 'We are excited to announce...',
                photoUrl: 'https://storage.googleapis.com/...',
                academyId: 1,
                createdAt: '2025-01-01T00:00:00.000Z',
                updatedAt: '2025-01-01T00:00:00.000Z'
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
        schema: {
            example: {
                statusCode: 400,
                message: [
                    'title should not be empty',
                    'content should not be empty',
                    'academyId must be a number'
                ],
                error: 'Bad Request'
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Authentication required',
        schema: {
            example: {
                statusCode: 401,
                message: 'Unauthorized',
                error: 'Unauthorized'
            }
        }
    })
    async create(
        @Body() dto: CreatePostDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        let photoUrl: string | null = null;
        
        if (file) {
            const fileName = 'post_cover/' + uuidv4() + extname(file.originalname);
            const bucket = firebaseAdmin.storage().bucket();
            const fileUpload = bucket.file(fileName);

            const stream = fileUpload.createWriteStream({
                metadata: {
                    contentType: file.mimetype
                }
            });

            await new Promise((resolve, reject) => {
                stream.on('error', (error) => {
                    console.error('Error uploading file:', error);
                    reject(error);
                });

                stream.on('finish', async () => {
                    await fileUpload.makePublic();
                    photoUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                    resolve(photoUrl);
                });

                stream.end(file.buffer);
            });
        }

        return this.postService.create(dto, photoUrl);
    }
}
