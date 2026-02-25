import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginWithEmailDto } from './dto/login-with-email.dto';
import { LoginWithCodeDto } from './dto/login-with-code.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-with-email')
  login(@Body() dto: LoginWithEmailDto) {
    return this.authService.loginWithEmail(dto);
  }

  @Post('login-with-code')
  loginWithCode(@Body() dto: LoginWithCodeDto) {
    return this.authService.loginWithCode(dto);
  }

  @Post('send-code')
  sendCode(@Body() dto: SendCodeDto) {
    return this.authService.sendCode(dto);
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
