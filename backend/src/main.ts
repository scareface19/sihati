import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('SihatiBootstrap');

  try {
    const sq = require('sqlite3');
    logger.log('Native sqlite3 module verified and loaded successfully.');
  } catch (err: any) {
    logger.error('Failed to require sqlite3:', err?.message || err);
  }

  const app = await NestFactory.create(AppModule);

  // Activation CORS pour Next.js (Web) et Expo (Mobile)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Configuration Swagger Documentation API
  const config = new DocumentBuilder()
    .setTitle('صحّتي (SIHATI) API')
    .setDescription(
      'API Backend de santé numérique algérienne - Gestion des dossiers patients, ordonnances électroniques, nomenclature des 560 médicaments 2025, urgences SOS et rendez-vous.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3005;
  await app.listen(port, '0.0.0.0');
  logger.log(`=======================================================`);
  logger.log(` API SIHATI démarrée avec succès sur le port: ${port}`);
  logger.log(` Documentation Swagger: http://localhost:${port}/api/docs`);
  logger.log(` Initialisation MySQL: http://localhost:${port}/seed/init`);
}
bootstrap().catch((err) => {
  console.error('CRITICAL BOOTSTRAP ERROR:', err);
  process.exit(1);
});

