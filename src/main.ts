import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { stage } from './constants';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';

let server: Handler | undefined;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Muzic API')
    .setDescription('This API provides a REST API for the Muzic backend')
    .setVersion('1.0')
    .addServer(`/${stage}`)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const swaggerUiPath = path.join(
    process.cwd(),
    'node_modules',
    'swagger-ui-dist',
  );
  const expressApp = app.getHttpAdapter().getInstance();
  app.useStaticAssets(swaggerUiPath, { prefix: '/api', redirect: false });
  document.tags = [
    { name: 'auth', description: 'Authentication routes' },
    { name: 'users', description: 'User routes' },
    { name: 'pages', description: 'Pages routes ' },
  ];
  const apiPrefix = stage ? `/${stage}` : '';
  const swaggerAssetBase = `${apiPrefix}/api`;
  SwaggerModule.setup('api', app, document, {
    customCssUrl: `${swaggerAssetBase}/swagger-ui.css`,
    customJs: [
      `${swaggerAssetBase}/swagger-ui-bundle.js`,
      `${swaggerAssetBase}/swagger-ui-standalone-preset.js`,
    ],
    customfavIcon: `${swaggerAssetBase}/favicon-32x32.png`,
  });
  await app.init();
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
