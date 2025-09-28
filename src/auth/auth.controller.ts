import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() credentials: SignInDto) {
    return this.authService.login(credentials.email, credentials.password);
  }

  @Post('signup')
  async signUp(@Body() credentials: SignUpDto) {
    return this.authService.register(credentials);
  }
}
