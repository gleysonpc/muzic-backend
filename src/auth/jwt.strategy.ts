import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

import { User } from 'src/users/user.interface';

import { UserRepository } from 'src/users/user.repository';
import { UserMeResponse } from 'src/users/dto/user-me.dto';

type JwtPayload = {
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.userRepository.findByEmail(payload.email);
      if (!user) {
        console.log('User not found in JWT strategy');
        throw new ForbiddenException('Access Denied!');
      }

      const userMeContent: UserMeResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      return userMeContent;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Access Denied!');
    }
  }
}
