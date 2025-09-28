import { Injectable } from '@nestjs/common';
import { User, UserKey } from './user.interface';
import { UserRepository } from './user.repository';
import { InjectModel, type Model } from 'nestjs-dynamoose';
import * as crypto from 'crypto';

@Injectable()
export class UserDynamoDBRepository implements UserRepository<User> {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
  ) {}

  private generateUUID(): string {
    return crypto.randomUUID();
  }

  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    try {
      const newUser = { id: this.generateUUID(), ...user };
      const result = await this.userModel.create(newUser);
      return result;
    } catch (error) {
      console.error('Error creating user', error);
      throw error;
    }
  }

  async update(key: UserKey, user: Partial<User>): Promise<User> {
    try {
      const result = await this.userModel.update(key, user);
      return result;
    } catch (error) {
      console.error('Error updating user', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      // Use a query against the GSI `userByEmail` instead of a scan.
      // Querying the index provides a KeyConditionExpression and is efficient.
      const result = await this.userModel
        .query({
          email: { eq: email },
        })
        .using('userByEmail')
        .exec();

      return result && result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error finding user by email', error);
      throw error;
    }
  }

  async findOne(key: UserKey): Promise<User | null> {
    try {
      const result = await this.userModel.get(key);
      return result;
    } catch (error) {
      console.error('Error finding user', error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const result = await this.userModel.scan().exec();
      return result;
    } catch (error) {
      console.error('Error scanning users', error);
      throw error;
    }
  }
}
