import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { skipAuth } from 'src/decorators/skipAuth.decorator';
import { AuthGuard } from './auth.guard';

@skipAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  async signUp(@Body() registerDto: RegisterDto, @UploadedFile() image: Express.Multer.File) {
    return this.authService.signUp(registerDto, image);
  }

  @Post('login')
  signIn(@Body() LoginDto: LoginDto) {
    return this.authService.signIn(LoginDto.email, LoginDto.password);
  }

  @Post('send-recovery-email')
  async sendRecoveryEmail(@Body('email') email: string) {
    return this.authService.sendRecoveryEmail(email);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() request) {
    return request.user;
  }

}
