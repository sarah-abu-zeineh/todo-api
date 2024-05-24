// src/auth/auth.service.ts
import { Injectable, ConflictException, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { join } from 'path';
import * as fs from 'fs';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private usersService: UsersService,
    private mailService: MailService,
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
    const payload = { id: newUser._id, username: newUser.name };

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

  async sendRecoveryEmail(email: string) {
    const isUserExist: boolean = await this.usersService.checkUserExistence(email);

    if (!isUserExist) {
      throw new NotFoundException('User not found');
    }

    if (isUserExist) {
      const verificationCode = this.generateVerificationCode();
      const verificationTemplatePath = 'verification-code.txt';
      const user: User = await this.userModel.findOneAndUpdate({ email }, { verificationCode });
      const text: string = this.generateEmailText(user, verificationTemplatePath);
      const subject: string = "Email Recovery";

      try {
        await this.mailService.sendMail(email, subject, text);
        
        return { message: 'Email send successfully' };
      } catch (error) {
        throw new InternalServerErrorException('Failed to send recovery email');
      }
    } else {
      throw new NotFoundException();
    }
  }

  async verifyEmail(email: string, verificationCode: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user && user.verificationCode === verificationCode) {
      user.verificationCode = null;
      user.isVerified = true;
      await user.save();

      return true;
    }
    return false;
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.isVerified = null;
      user.password = hashedPassword;
      await user.save();

      return { message: 'Password updated successfully' };
    }

    throw new InternalServerErrorException('User is not verified');
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateEmailText(user: User, filePath: string): string {
    const templatePath = join('templates', filePath);
    const emailTemplate = fs.readFileSync(templatePath, 'utf-8');

    return this.populateEmailTemplate(emailTemplate, user);
  }

  populateEmailTemplate(template: string, user: User): string {
    return template
      .replace(/{name}/g, user.name)
      .replace(/{verificationCode}/g, user.verificationCode);
  }
}
