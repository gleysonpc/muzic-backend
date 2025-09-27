import { UserKey } from './user.interface';

export abstract class UserRepository<T> {
  abstract create(user: Omit<T, 'id' | 'createdAt'>): Promise<T>;
  abstract update(key: UserKey, user: Partial<T>): Promise<T>;
  abstract findOne(key: UserKey): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
}
