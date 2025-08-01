import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, CreateSuperAdminDto, SignUpDto } from "./dto/auth.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';
import { extname, resolve } from 'path';
import * as firebaseAdmin from 'firebase-admin';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/signup")
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: SignUpDto })
    @ApiResponse({ 
        status: HttpStatus.CREATED, 
        description: 'User successfully registered',
        schema: {
            example: {
                access_token: 'jwt.token.here',
                user: {
                    id: 1,
                    email: 'user@example.com',
                    firstName: 'John',
                    lastName: 'Doe'
                }
            }
        }
    })
    @ApiResponse({ 
        status: HttpStatus.BAD_REQUEST, 
        description: 'Bad Request - Invalid input data' 
    })
    @ApiResponse({ 
        status: HttpStatus.CONFLICT, 
        description: 'Conflict - Email already exists' 
    })
    signup(@Body() signUpDto: SignUpDto) {
        return this.authService.signup(signUpDto);
    }

    @Post("/login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'User login' })
    @ApiBody({ type: AuthDto })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'User successfully logged in',
        schema: {
            example: {
                access_token: 'jwt.token.here',
                user: {
                    id: 1,
                    email: 'user@example.com',
                    firstName: 'John',
                    lastName: 'Doe'
                }
            }
        }
    })
    @ApiResponse({ 
        status: HttpStatus.UNAUTHORIZED, 
        description: 'Unauthorized - Invalid credentials' 
    })
    @ApiResponse({ 
        status: HttpStatus.BAD_REQUEST, 
        description: 'Bad Request - Invalid input data' 
    })
    login(@Body() authDto: AuthDto) {
        return this.authService.login(authDto);
    }

    @Post("/createSuperAdmin")
    @UseInterceptors(
        FileInterceptor("profilePhoto",{
            storage: memoryStorage(),
            limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit  
        })
    )
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a super admin (protected)' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email', example: 'admin@example.com' },
                password: { type: 'string', example: 'securePassword123', minLength: 6 },
                firstName: { type: 'string', example: 'Admin' },
                lastName: { type: 'string', example: 'User' },
                profilePhoto: {
                    type: 'string',
                    format: 'binary',
                    description: 'Profile photo file (optional)'
                }
            },
            required: ['email', 'password']
        }
    })
    @ApiResponse({ 
        status: HttpStatus.CREATED, 
        description: 'Super admin successfully created',
        schema: {
            example: {
                id: 1,
                email: 'admin@example.com',
                firstName: 'Admin',
                lastName: 'User',
                role: 'SUPER_ADMIN',
                profilePhoto: 'https://storage.googleapis.com/...',
                createdAt: '2025-01-01T00:00:00.000Z',
                updatedAt: '2025-01-01T00:00:00.000Z'
            }
        }
    })
    @ApiResponse({ 
        status: HttpStatus.UNAUTHORIZED, 
        description: 'Unauthorized - Admin privileges required' 
    })
    @ApiResponse({ 
        status: HttpStatus.BAD_REQUEST, 
        description: 'Bad Request - Invalid input data' 
    })
    async createSuperAdmin(
        @Body() createSuperAdminDto: CreateSuperAdminDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        console.log("===========>  ", file);
        let photoProfileUrl: string = "";
        if (file) {
            const fileName = 'super_admin/profile_photo/' + uuidv4() + extname(file.originalname);
            const bucket = firebaseAdmin.storage().bucket();
            const fileUpload = bucket.file(fileName);

            const stream = fileUpload.createWriteStream({
                metadata: {
                    contentType: file.mimetype
                }
            })

            await new Promise((resolve, reject) => {

                stream.on("error", (error) => {
                    console.error(" Error uploading file:", error)
                    reject(error)
                })

                stream.on("finish", async () => {
                    console.log(" File uploaded successfully")
                    await fileUpload.makePublic();
                    photoProfileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
                    resolve(null)
                })

                stream.end(file.buffer)
            })
        }

        return this.authService.createSuperAdmin(createSuperAdminDto, photoProfileUrl);
    }
}