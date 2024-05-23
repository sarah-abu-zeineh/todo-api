import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  async signUp(@Body() registerDto: RegisterDto, @UploadedFile() image: Express.Multer.File) {
    return this.authService.signUp(registerDto, image);
  }

  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
