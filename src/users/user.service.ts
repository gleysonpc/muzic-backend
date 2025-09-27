import { Injectable } from '@nestjs/common';
import { User, UserKey } from './user.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UserRepository<User>) {}

  async create(user: Omit<User, 'id'>) {
    return this.usersRepository.create(user);
  }

  async update(key: UserKey, user: Partial<User>) {
    return this.usersRepository.update(key, user);
  }

  async findOneById(key: UserKey) {
    return this.usersRepository.findOne(key);
  }

  async findAll() {
    return this.usersRepository.findAll();
  }
}
