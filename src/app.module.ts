import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AcademyModule } from './academy/academy.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { CourseModule } from './course/course.module';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { StudentModule } from './student/student.module';
import { EnrollmentRequestModule } from './enrollment-request/enrollment-request.module';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal : true,
      envFilePath: '../../.env'
    }) ,
    AuthModule,
    PrismaModule, 
    UserModule, AcademyModule, SuperAdminModule, CourseModule, PostModule, StudentModule, EnrollmentRequestModule, TeacherModule, 
  ],
  controllers : [AppController, PostController]
})
export class AppModule {}
