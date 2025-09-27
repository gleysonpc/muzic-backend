import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UsersController } from './users.controller';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserDynamoDBRepository } from './user.dynamodb.repository';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
        options: {
          tableName: process.env.MUZIC_USERS_TABLE,
          create: false, // Don't try to create the table
          waitForActive: false, // Don't wait for table to be active
        },
      },
    ]),
  ],
  providers: [
    { provide: UserRepository, useClass: UserDynamoDBRepository },
    UserService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
