import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Logger } from 'nestjs-pino';

@Injectable()
export class EmailService {
  private readonly transporter;
  private readonly logger: Logger;

  constructor(private readonly configService: ConfigService,       logger: Logger
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: configService.get<string>('GMAIL_USER'),
        pass: configService.get<string>('GMAIL_PASS'),
      },
    });

    this.logger = logger;
  }

  async sendEmail(data: any) {
    try {
      const { userLimit, userId } = data;
      const subject = 'User has reached its limits';
      const text = `User with userId ${userId} has reached its limits. UserLimit = ${userLimit}`
      await this.transporter.sendMail({
        from: this.configService.get<string>('GMAIL_USER'),
        to: this.configService.get<string>('GMAIL_USER'),
        subject,
        text,
      });

      this.logger.log('Message sent successfully');

    } catch (error) {
      this.logger.debug(error?.message);
    }

  }
}
