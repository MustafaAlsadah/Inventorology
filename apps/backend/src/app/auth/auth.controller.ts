import { Controller, Get, Post, UseGuards, Body, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  async getProtected(): Promise<string> {
    return 'This route is protected by JWT';
  }

  @Post('signup')
  async signup(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      role: string;
    }
  ) {
    const { name, email, password, role } = body;
    return this.authService.signup(name, email, password, role);
  }

  @Post('signin')
  async signin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.signin(email, password);
  }

  @Post('send-password-reset-email')
  async sendPasswordResetEmail(@Body() body: { email: string }) {
    const { email } = body;
    return this.authService.sendPasswordResetEmail(email);
  }

  @Patch('password-reset')
  async resetPassword(
    @Body('email') email: string,
    @Body('new_password') new_password: string,
    @Body('entered_otp') entered_otp: string
  ) {
    return this.authService.resetPassword(email, new_password, entered_otp);
  }
}
