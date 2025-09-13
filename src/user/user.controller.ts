import { 
    Body, 
    Controller, 
    Get, 
    HttpCode, 
    HttpStatus, 
    Param, 
    ParseIntPipe, 
    Patch, 
    Post, 
    UploadedFile, 
    UseGuards, 
    UseInterceptors,
    BadRequestException,
    Request
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as firebaseAdmin from 'firebase-admin';
import { 
    ApiTags, 
    ApiOperation, 
    ApiResponse, 
    ApiBody, 
    ApiConsumes, 
    ApiParam, 
    ApiBearerAuth,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiHeader
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/decoretor/get-user.decorator';
import { UserService } from './user.service';
import { UserDto } from './dto';
import { getUserIdFromRequest } from 'src/utils/getUserIdFromRequest';

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('me')
    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ 
        summary: 'Get current user profile',
        description: 'Retrieves the profile of the currently authenticated user. Requires a valid JWT token in the Authorization header.'
    })
    @ApiBearerAuth('JWT-auth')
    @ApiHeader({
        name: 'Authorization',
        description: 'JWT token',
        required: true,
        schema: {
            type: 'string',
            default: 'Bearer your-jwt-token-here'
        }
    })
    @ApiOkResponse({
        description: 'Successfully retrieved user profile',
        schema: {
            example: {
                id: 1,
                email: 'user@example.com',
                firstName: 'John',
                lastName: 'Doe',
                profilePhoto: 'https://example.com/profile.jpg',
                isSuperAdmin: false,
                createdAt: '2025-01-01T00:00:00.000Z',
                updatedAt: '2025-01-01T00:00:00.000Z'
            }
        }
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized - No valid token provided or token expired',
        schema: {
            example: {
                statusCode: 401,
                message: 'Unauthorized',
                error: 'Unauthorized'
            }
        }   
    })
    async getMe(@Request() req) {
        const userId = getUserIdFromRequest(req);
        if (userId) {
            return this.userService.getUserById(userId);
        } else {
            throw new BadRequestException('User not found');
        }  
    }
    

    @Get('by-email/:email')
    @ApiOperation({ 
        summary: 'Get user by email',
        description: 'Retrieves a user profile by email address.'
    })
    @ApiParam({
        name: 'email',
        required: true,
        description: 'Email address of the user to retrieve',
        example: 'user@example.com'
    })
    @ApiOkResponse({
        description: 'Successfully retrieved user by email',
        type: UserDto
    })
    @ApiNotFoundResponse({
        description: 'User not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'User not found',
                error: 'Not Found'
            }
        }
    })
    @ApiBadRequestResponse({
        description: 'Invalid email format',
        schema: {
            example: {
                statusCode: 400,
                message: 'Invalid email format',
                error: 'Bad Request'
            }
        }
    })
    getUserByEmail(@Param('email') email: string) {
        if (!email.includes('@')) {
            throw new BadRequestException('Invalid email format');
        }
        return this.userService.getUserByEmail(email);
    }

    @Get(':id')
    //@UseGuards(JwtGuard)
    @ApiOperation({ 
        summary: 'Get user by ID',
        description: 'Retrieves a user profile by ID. Requires authentication.'
    })
    @ApiBearerAuth()
    @ApiParam({
        name: 'id',
        required: true,
        description: 'ID of the user to retrieve',
        example: 1
    })
    @ApiOkResponse({
        description: 'Successfully retrieved user by ID',
        type: UserDto
    })
    @ApiNotFoundResponse({
        description: 'User not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'User not found',
                error: 'Not Found'
            }
        }
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized - No valid token provided',
        schema: {
            example: {
                statusCode: 401,
                message: 'Unauthorized',
                error: 'Unauthorized'
            }
        }
    })
    async getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getUserById(id);
    }

    @Post('edit-profile/:id')
    @UseGuards(JwtGuard)
    @UseInterceptors(
        FileInterceptor('profilePhoto', {
            storage: memoryStorage(),
            limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
        })
    )
    @ApiOperation({ 
        summary: 'Update user profile',
        description: 'Updates a user\'s profile information and/or photo. Requires authentication.'
    })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiParam({
        name: 'id',
        required: true,
        description: 'ID of the user to update',
        example: 1
    })
    @ApiBody({
        description: 'User profile update data',
        required: false,
        schema: {
            type: 'object',
            properties: {
                firstName: { 
                    type: 'string',
                    example: 'John',
                    description: 'User\'s first name'
                },
                lastName: { 
                    type: 'string',
                    example: 'Doe',
                    description: 'User\'s last name'
                },
                phone: { 
                    type: 'string',
                    example: '+1234567890',
                    description: 'User\'s phone number'
                },
                profilePhoto: {
                    type: 'string',
                    format: 'binary',
                    description: 'User\'s profile photo (max 5MB, jpg/jpeg/png)'
                }
            },
            required : ['firstName','lastName','phone','profilePhoto']
        }
    })
    @ApiOkResponse({
        description: 'Profile updated successfully',
        type: UserDto
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data',
        schema: {
            example: {
                statusCode: 400,
                message: 'Invalid input data',
                error: 'Bad Request'
            }
        }
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized - No valid token provided',
        schema: {
            example: {
                statusCode: 401,
                message: 'Unauthorized',
                error: 'Unauthorized'
            }
        }
    })
    async editProfile(
        @Param('id', ParseIntPipe) id: number,
        @Body() userDto: UserDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        let photoUrl: string | null = null;
        
        if (file) {
            const fileName = `profile_photos/${uuidv4()}${extname(file.originalname)}`;
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
                    reject(new BadRequestException('Error uploading file'));
                });

                stream.on('finish', async () => {
                    await fileUpload.makePublic();
                    photoUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                    resolve(photoUrl);
                });

                stream.end(file.buffer);
            });
        }
        return this.userService.editProfile(userDto);
    }

    @Post('change-profilePhoto/:id')
    @UseInterceptors(
        FileInterceptor("profilePhoto",{
            storage : memoryStorage(), //in-memory buffer
        })
    )
    @ApiOperation({ 
        summary: 'Change user profile photo',
        description: 'Changes a user\'s profile photo. Requires authentication.'
    })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiParam({
        name: 'id',
        required: true,
        description: 'ID of the user to update',
        example: 1
    })
    @ApiBody({
        description: 'User profile photo update data',
        required: false,
        schema: {
            type: 'object',
            properties: {
                profilePhoto: {
                    type: 'string',
                    format: 'binary',
                    description: 'User\'s profile photo (max 5MB, jpg/jpeg/png)'
                }
            },
            required : ['profilePhoto']
        }
    })
    @ApiOkResponse({
        description: 'Profile photo updated successfully',
        type: UserDto
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data',
        schema: {
            example: {
                statusCode: 400,
                message: 'Invalid input data',
                error: 'Bad Request'
            }
        }
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized - No valid token provided',
        schema: {
            example: {
                statusCode: 401,
                message: 'Unauthorized',
                error: 'Unauthorized'
            }
        }
    })
    async changeProfilePhoto(
        @Param('id' , ParseIntPipe) userId : number,
        @UploadedFile() file?
    ) {
        console.log("log we are here 1")
        let logoUrl : string | null = null
        if(file){
            
        console.log("log we are here 2")
            const fileName = 'profile_photo/' + uuidv4() + extname(file.originalname)

            const bucket = firebaseAdmin.storage().bucket()

            const fileUpload = bucket.file(fileName)

            const stream = fileUpload.createWriteStream({
                metadata : {
                    contentType : file.mimetype
                }
            })


            await new Promise((resolve , reject) => {

                
                console.log("log we are here 3")
                stream.on("error" , (error) => {
                    console.error("❌ Error uploading file:", error)
                    reject(error)
                })

                
                console.log("log we are here 4")
                stream.on("finish" , async () => {
                    console.log("✅ File uploaded successfully")
                    await fileUpload.makePublic();
                    logoUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
                    resolve(null)
                })

                console.log("log we are here 5")
                stream.end(file.buffer)
                
            })   
        }    

        
        console.log("log we are here 6")

        return this.userService.changeProfilePhoto(userId , logoUrl);
    }
}
