import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      description: 'Muzic Backend',
      version: '1.0.0',
      status: 'UP',
    };
  }
}
