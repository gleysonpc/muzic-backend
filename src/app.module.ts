import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ConfigModule } from '@nestjs/config';
import { dynamoLocalConfig } from './utils/dynamodb-local-config';
import { PagesModule } from './pages/pages.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DynamooseModule.forRoot(dynamoLocalConfig),
    UsersModule,
    PagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
