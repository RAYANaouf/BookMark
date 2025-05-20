import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as firebaseAdmin from 'firebase-admin'
import * as dotenv from 'dotenv'
dotenv.config()

import * as fs from 'fs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //swagger 
  const config = new DocumentBuilder()
  .setTitle('J-Learn')
  .setDescription('J-Learn API')
  .setVersion('1.0')
  .build()

  const document = SwaggerModule.createDocument(app , config)
  SwaggerModule.setup('api' , app , document)

  app.useGlobalPipes(new ValidationPipe({
    whitelist : true
  }))


  app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
  });


  //firebase admin

  if(firebaseAdmin.apps.length === 0){
    console.log("Initializing Firebase Admin...");
    
    try{
      firebaseAdmin.initializeApp({
        credential : firebaseAdmin.credential.cert({
          privateKey : process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail : process.env.FIREBASE_CLIENT_EMAIL,
          projectId : process.env.FIREBASE_PROJECT_ID
        } as Partial<firebaseAdmin.ServiceAccount>),
        storageBucket : process.env.FIREBASE_PROJECT_ID + '.appspot.com'
      })

      console.log("✅ Firebase Admin initialized");
    }catch(error){
      console.error("❌ Firebase Admin failed to initialize:", error);
    }
  }
  

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
