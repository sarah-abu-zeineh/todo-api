import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_SERVICE'),
      port: 587,
      secure: false, 
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('SMTP_USER'),
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
