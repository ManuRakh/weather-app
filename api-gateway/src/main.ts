import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { ConfigService } from '@nestjs/config';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import { fastifyCookie } from '@fastify/cookie';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { VersioningType } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomValidationPipe } from './validation.pipe';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function runServer() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3001);
  const logger = app.get(Logger);

  app.useLogger(logger);
  app.useGlobalGuards(app.get(JwtAuthGuard));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new CustomValidationPipe());

  app.setGlobalPrefix('api', {
    exclude: ['healthcheck(.*)'],
  });

  const env = configService.get<string>('env');

  if (env !== 'prod') {
    const version = configService.get<string>('version');
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Weather Service')
      .setDescription('Weather Service API')
      .setVersion(version)
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api_doc', app, document);
  }

  await app.register(helmet, {
    contentSecurityPolicy: configService.get('env') === 'prod',
  });
  await app.register(fastifyCookie as any);
  await app.register(fastifyCsrf);

  await app.listen(port, '0.0.0.0');
}

runServer();
