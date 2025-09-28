import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserSchema } from '../users/user.schema';
import { UserRepository } from '../users/user.repository';
import { UserDynamoDBRepository } from '../users/user.dynamodb.repository';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';

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
    JwtModule.register({ secret: jwtConstants.secret }),
  ],
  providers: [
    { provide: UserRepository, useClass: UserDynamoDBRepository },
    AuthService,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
