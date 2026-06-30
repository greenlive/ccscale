import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { TurnstileService } from './common/turnstile.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Fail fast in production if Turnstile is not configured. Throws before
  // binding to the port, so Railway's healthcheck won't pass either.
  const turnstile = app.get(TurnstileService);
  turnstile.assertProductionReady();

  // Security headers with Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Reject oversized JSON/URL-encoded bodies early. Default Nest limit is
  // 100kb; admins uploading product specs / descriptions need more, but
  // anything over 1MB is almost certainly abuse. Multipart upload routes
  // use multer and are not affected by this limit.
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));

  // CORS configuration
  const corsOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Bearer', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400, // 24 hours
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTOs
      forbidNonWhitelisted: false, // Don't reject - silently strip instead
      transform: true, // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('CC Scale API')
    .setDescription('API for CC Scale B2B platform - Secure B2B weighing scales marketplace')
    .setVersion('1.0')
    .addTag('products', 'Product management endpoints')
    .addTag('inquiries', 'Customer inquiry management endpoints')
    .addTag('analytics', 'Analytics and statistics endpoints')
    .addTag('auth', 'Authentication and authorization endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = parseInt(process.env.PORT, 10) || 8000;
  await app.listen(port);
  console.log(`API server is running on http://localhost:${port}`);
  console.log(`API docs: http://localhost:${port}/api/docs`);
  console.log(`Rate limiting enabled`);
  console.log(`Security headers enabled`);
  console.log(`Turnstile: ${turnstile.isConfigured() ? 'configured' : 'bypassed (dev only)'}`);
}

bootstrap();