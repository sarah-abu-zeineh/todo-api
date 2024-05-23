// src/auth/auth.service.ts
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signUp(registerDto: RegisterDto, image: Express.Multer.File | undefined):
    Promise<{ access_token: string }> {
    const { email, password, name } = registerDto;
    const userExists = await this.usersService.findByEmail(email);

    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData: RegisterDto = { email, password: hashedPassword, name };
    const newUser = await this.usersService.create(userData, image);
    const payload = { id: newUser._id, username: newUser.name};

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const payload = { id: user._id, username: user.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
