import { Injectable } from '@nestjs/common';
import { InjectModel, type Model } from 'nestjs-dynamoose';
import { User, UserKey } from './user.interface';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
  ) {}

  private generateUUID(): string {
    return crypto.randomUUID();
  }

  async create(user: Omit<User, 'id'>) {
    try {
      const newUser = { id: this.generateUUID(), ...user };
      console.log('Creating user with data:', newUser);
      const result = await this.userModel.create(newUser);
      console.log('Successfully created user:', result);
      return result;
    } catch (error) {
      console.error('Error creating user in DynamoDB:', error);
      throw error;
    }
  }

  async update(key: UserKey, user: Partial<User>) {
    try {
      console.log('Updating user:', key, 'with data:', user);
      const result = await this.userModel.update(key, user);
      console.log('Successfully updated user:', result);
      return result;
    } catch (error) {
      console.error('Error updating user in DynamoDB:', error);
      throw error;
    }
  }

  async findOne(key: UserKey) {
    try {
      console.log('Finding user with key:', key);
      const result = await this.userModel.get(key);
      console.log('Found user:', result);
      return result;
    } catch (error) {
      console.error('Error finding user in DynamoDB:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      console.log('Finding all users');
      const result = await this.userModel.scan().exec();
      console.log('Found users:', result);
      return result;
    } catch (error) {
      console.error('Error scanning users in DynamoDB:', error);
      throw error;
    }
  }
}
