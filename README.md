## Description

Muzic backend API built with NestJS and deployed with SST (AWS).

## Prerequisites

- Node.js (see `.nvmrc`)
- Yarn 1.x
- AWS credentials (profile configured in `.env`)
- Docker (for local DynamoDB)

## Project setup

```bash
yarn install
```

## Environment variables

Create or update `.env` with:

```bash
DYNAMO_ENDPOINT=http://localhost:8080
AWS_PROFILE=personal
```

## Local DynamoDB

```bash
yarn dynamodb:up
```

Optional admin UI:

```bash
yarn dynamodb:admin
```

## Development (SST)

Builds NestJS and starts SST in dev mode:

```bash
yarn dev
```

The API Gateway stage is part of the URL (`/dev` by default).

## Deployment

```bash
yarn deploy
```

## Swagger

The Swagger UI is served at:

```
https://<api-id>.execute-api.us-east-1.amazonaws.com/dev/api
```

If you change the stage, update the URL accordingly.
