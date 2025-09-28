import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.interface';
import { UserRepository } from 'src/users/user.repository';

export type JwtPayload = {
  email: string;
  sub: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private singToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  async validateUser(username: string, password: string) {
    const foundUser = await this.userRepository.findByEmail(username);
    if (!foundUser) {
      throw new ForbiddenException('Incorrect Credentials!');
    }

    if (!foundUser.password) {
      // If for some reason the stored user has no password field, avoid calling bcrypt with undefined.
      console.error(
        'User found but password is undefined for user id:',
        foundUser.id,
      );
      throw new ForbiddenException('Incorrect Credentials!');
    }

    const passwordMatches = bcrypt.compareSync(password, foundUser.password);
    if (!passwordMatches) {
      throw new ForbiddenException('Incorrect Credentials!');
    }

    const payload: JwtPayload = {
      email: foundUser.email,
      sub: foundUser.id,
    };
    return {
      access_token: this.singToken(payload),
    };
  }

  async register(user: CreateUserDto) {
    const createdUser = await this.userRepository.create({
      name: user.name,
      email: user.email,
      password: this.hashPassword(user.password),
    });

    const result = {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
    };

    return result;
  }

  async login(email: string, password: string) {
    return await this.validateUser(email, password);
  }
}
