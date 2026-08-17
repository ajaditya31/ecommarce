import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe — strips unknown fields, validates DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger / OpenAPI docs at /api/docs
  const config = new DocumentBuilder()
    .setTitle('Product Service')
    .setDescription('CRUD API for product management')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3001);
  console.log('product-service running on http://localhost:3001');
  console.log('Swagger docs at http://localhost:3001/api/docs');
}
bootstrap();
