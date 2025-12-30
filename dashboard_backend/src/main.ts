import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.setGlobalPrefix('api/v1'); 

  // Hugging Face portu (7860) veya yerel 3000
  const port = process.env.PORT || 3000;
  
  // ÖNEMLİ DEĞİŞİKLİK: '0.0.0.0' ekledik. 
  // Bu olmadan Hugging Face dışarıdan gelen istekleri göremez.
  await app.listen(port, '0.0.0.0');
  
  console.log(`Backend Çalışıyor: http://0.0.0.0:${port}`);
}
bootstrap();