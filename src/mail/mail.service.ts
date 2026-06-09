import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get('MAIL_HOST', 'smtp.gmail.com'),
      port: config.get<number>('MAIL_PORT', 587),
      secure: false,
      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASS'),
      },
    });
  }

  async sendInquiryNotification(inquiry: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) {
    const recipients = [
      'nancymwa087@gmail.com',
      'shalamproperties@yahoo.com',
    ];

    try {
      await this.transporter.sendMail({
        from: `"Shalam Properties" <${this.config.get('MAIL_USER')}>`,
        to: recipients.join(', '),
        subject: `New Inquiry from ${inquiry.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0ea5e9;">New Inquiry — Shalam Properties</h2>
            <table style="width:100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold;">Name</td><td style="padding: 8px;">${inquiry.name}</td></tr>
              <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Phone</td><td style="padding: 8px;">${inquiry.phone || '—'}</td></tr>
              <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold; vertical-align:top;">Message</td><td style="padding: 8px;">${inquiry.message}</td></tr>
            </table>
            <p style="margin-top: 24px; color: #666; font-size: 12px;">
              Log in to the <a href="http://localhost:5173/admin/inquiries">admin dashboard</a> to respond.
            </p>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send inquiry email', err);
    }
  }
}
