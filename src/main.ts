import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { stage } from './constants';

let server: Handler | undefined;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Muzic API')
    .setDescription('This API provides a REST API for the Muzic backend')
    .setVersion('1.0')
    .addServer(`/${stage}`)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  document.tags = [
    { name: 'auth', description: 'Authentication routes' },
    { name: 'users', description: 'User routes' },
    { name: 'pages', description: 'Pages routes ' },
  ];
  SwaggerModule.setup('api', app, document);
  await app.init();

  const expressApp = app
    .getHttpAdapter()
    .getInstance() as import('express').Express;
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
): Promise<any> => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
