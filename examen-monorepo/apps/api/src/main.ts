import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Habilitar CORS para que el frontend pueda consumir el backend
  app.enableCors();

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Proyección de Interés Compuesto')
    .setDescription('API v1 (abierta) y v2 (requiere x-api-key) para calcular interés compuesto')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(
    `📄 Swagger docs: http://localhost:${port}/api/docs`
  );
}

bootstrap();
