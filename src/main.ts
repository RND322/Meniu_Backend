import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Sirve archivos estáticos desde /uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Habilita validación global
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Meniu API')
    .setDescription('API para sistema de pedidos en restaurantes')
    .setVersion('1.0')
    .addTag('productos')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'JWT-auth', // este es el nombre del esquema
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Habilita CORS para todos los dominios 
  app.enableCors({
    origin: '*',               // o un array ['https://mi-frontend.com']
    methods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS',
    credentials: true,         // si se usan cookies o credenciales
    allowedHeaders: '*',       // o lista concreta
  });

  await app.listen(process.env.PORT ?? 3000);

  //console.log('JWT_SECRET:', process.env.JWT_SECRET);
}
bootstrap();