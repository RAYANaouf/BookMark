import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TeacherModule } from './teacher/teacher.module';
import { AcademyModule } from './academy/academy.module';
import { SuperAdminModule } from './super-admin/super-admin.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal : true,
      envFilePath: '../../.env'
    }) ,
    AuthModule,
    PrismaModule, 
    UserModule, TeacherModule, AcademyModule, SuperAdminModule, 
  ],
  controllers : [AppController]
})
export class AppModule {}
