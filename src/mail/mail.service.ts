import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(
    address: string,
    subject: string,
    context: Record<string, unknown>,
    templateName: string,
  ) {
    await this.mailerService.sendMail({
      to: address,
      // from: '"Support Team" <support@example.com>', // override default from
      subject,
      template: join(
        process.cwd(),
        'dist',
        'mail',
        'templates',
        `${templateName}.hbs`,
      ),
      context,
    });
  }
}
