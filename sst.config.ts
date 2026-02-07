/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app(input) {
    return {
      name: 'muzic-backend',
      home: 'aws',
      providers: {
        aws: {
          region: 'us-east-1',
        },
      },
    };
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  async run() {
    const usersTable = new sst.aws.Dynamo('UsersTable', {
      fields: {
        id: 'string',
        email: 'string',
      },
      primaryIndex: { hashKey: 'id' },
      globalIndexes: {
        userByEmail: { hashKey: 'email' },
      },
      transform: {
        table: {
          name: `MuzicUsersTable-${$app.stage}`,
        },
      },
    });

    const pagesTable = new sst.aws.Dynamo('PagesTable', {
      fields: {
        id: 'string',
        slug: 'string',
        userId: 'string',
      },
      primaryIndex: { hashKey: 'id' },
      globalIndexes: {
        pageBySlug: { hashKey: 'slug' },
        pagesByUser: { hashKey: 'userId' },
      },
      transform: {
        table: {
          name: `MuzicPagesTable-${$app.stage}`,
        },
      },
    });

    const dynamoEndpoint =
      process.env.SST_DEV === 'true'
        ? (process.env.DYNAMO_ENDPOINT ?? 'http://localhost:8080')
        : '';

    const api = new sst.aws.ApiGatewayV1('Api', {
      transform: {
        route: {
          handler: (args) => {
            args.memory ??= '256 MB';
            args.runtime ??= 'nodejs20.x';
            args.dev ??= false;
            const optionalExternals = [
              '@grpc/grpc-js',
              '@grpc/proto-loader',
              '@nestjs/platform-socket.io',
              'amqplib',
              'amqp-connection-manager',
              'class-transformer/storage',
              'ioredis',
              'kafkajs',
              'mqtt',
              'nats',
            ];
            const existingExternal =
              (args.nodejs?.esbuild as { external?: string[] } | undefined)
                ?.external ?? [];
            const existingCopyFiles = Array.isArray(args.copyFiles)
              ? args.copyFiles
              : args.copyFiles
                ? [args.copyFiles]
                : [];
            args.copyFiles = [
              ...existingCopyFiles,
              { from: 'node_modules/swagger-ui-dist', to: 'swagger-ui-dist' },
            ];
            const existingInstall = Array.isArray(args.nodejs?.install)
              ? (args.nodejs?.install ?? [])
              : args.nodejs?.install
                ? [args.nodejs.install]
                : [];
            args.nodejs = {
              ...args.nodejs,
              format: 'cjs',
              install: Array.from(
                new Set([...existingInstall, 'swagger-ui-dist']),
              ),
              esbuild: {
                ...(args.nodejs?.esbuild ?? {}),
                external: Array.from(
                  new Set([...existingExternal, ...optionalExternals]),
                ),
              },
            };
            args.environment = {
              ...args.environment,
              STAGE: $app.stage,
              MUZIC_USERS_TABLE: usersTable.name,
              MUZIC_PAGES_TABLE: pagesTable.name,
              DYNAMO_ENDPOINT: dynamoEndpoint,
            };
            const existingLink = Array.isArray(args.link)
              ? args.link
              : args.link
                ? [args.link]
                : [];
            args.link = [...existingLink, usersTable, pagesTable];
          },
        },
      },
    });

    api.route('ANY /', 'dist/main.handler');
    api.route('ANY /{proxy+}', 'dist/main.handler');
    api.deploy();

    return {
      ApiEndpoint: api.url,
    };
  },
});
