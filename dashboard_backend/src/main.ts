import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express'; // Bu eklendi
import { join } from 'path'; // Bu eklendi

dotenv.config();

async function bootstrap() {
  // <NestExpressApplication> tipini ekledik ki 'useStaticAssets' kullanabilelim
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // API rotaları '/api/v1' ile başlasın
  app.setGlobalPrefix('api/v1'); 

  // EKLENEN KISIM: React dosyalarını 'public' klasöründen sun
  // __dirname, 'dist' klasörüdür. Bir üstteki 'public'e çıkıyoruz.
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`Backend ve Frontend Çalışıyor: http://0.0.0.0:${port}`);
}
bootstrap();