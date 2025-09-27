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
      const result = await this.userModel.create(newUser);
      return result;
    } catch (error) {
      console.error('Error creating user', error);
      throw error;
    }
  }

  async update(key: UserKey, user: Partial<User>) {
    try {
      const result = await this.userModel.update(key, user);
      return result;
    } catch (error) {
      console.error('Error updating user', error);
      throw error;
    }
  }

  async findOne(key: UserKey) {
    try {
      const result = await this.userModel.get(key);
      return result;
    } catch (error) {
      console.error('Error finding user', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const result = await this.userModel.scan().exec();
      return result;
    } catch (error) {
      console.error('Error scanning users', error);
      throw error;
    }
  }
}
