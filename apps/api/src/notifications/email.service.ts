import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { escapeHtml, escapeUrl } from '../common/html-escape';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Low-level send. The `html` argument is sent as-is and is the caller's
   * responsibility to be properly escaped. Use the higher-level helpers below
   * for the user-inquiry flow.
   */
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"CC Scale" <noreply@zzscale.com>',
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${(error as Error).message}`);
      // Intentionally not throwing - email failure should not break the main flow,
      // but it is logged so ops can spot delivery issues.
    }
  }

  async sendInquiryConfirmation(inquiry: {
    fullName: string;
    email: string;
    items?: Array<{ productNameEn?: string; productNameZh?: string; quantity?: number }>;
    message?: string;
  }): Promise<void> {
    const safeName = escapeHtml(inquiry.fullName);
    const itemList = (inquiry.items ?? [])
      .map((item) => {
        const name = escapeHtml(item.productNameEn || item.productNameZh || 'Product');
        const qty = Math.max(1, Number(item.quantity) || 1);
        return `<li>${name} - Qty: ${qty}</li>`;
      })
      .join('');
    const safeMessage = inquiry.message
      ? `<p><strong>Your Message:</strong><br/>${escapeHtml(inquiry.message).replace(/\n/g, '<br/>')}</p>`
      : '';

    const subject = 'Thank you for your inquiry - CC Scale';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0A1628;">Thank You for Your Inquiry!</h1>
        <p>Dear ${safeName},</p>
        <p>We have received your inquiry and will get back to you within 24 hours.</p>
        ${itemList ? `<h3>Your Inquiry Details:</h3><ul>${itemList}</ul>` : ''}
        ${safeMessage}
        <p>Best regards,<br/>CC Scale Team</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">
          CC Scale Co., Ltd.<br/>
          sales@zzscale.com | +86 123 4567 8900
        </p>
      </div>
    `;
    await this.sendEmail(inquiry.email, subject, html);
  }

  async sendNewInquiryNotificationToAdmin(inquiry: {
    fullName: string;
    email: string;
    phone?: string;
    company?: string;
    country?: string;
    message?: string;
    items?: Array<{ productNameEn?: string; productNameZh?: string; quantity?: number }>;
  }): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@zzscale.com';
    const safeName = escapeHtml(inquiry.fullName);
    const safeEmail = escapeHtml(inquiry.email);
    const safePhone = inquiry.phone ? escapeHtml(inquiry.phone) : '';
    const safeCompany = inquiry.company ? escapeHtml(inquiry.company) : '';
    const safeCountry = inquiry.country ? escapeHtml(inquiry.country) : '';
    const safeMessage = inquiry.message
      ? `<h3 style="margin-top: 20px;">Message:</h3><p style="background: #f5f5f5; padding: 15px; border-radius: 4px;">${escapeHtml(inquiry.message).replace(/\n/g, '<br/>')}</p>`
      : '';
    const itemList = (inquiry.items ?? [])
      .map((item) => {
        const name = escapeHtml(item.productNameEn || item.productNameZh || 'Product');
        const qty = Math.max(1, Number(item.quantity) || 1);
        return `<li>${name} - Qty: ${qty}</li>`;
      })
      .join('');

    const safeAdminUrl = escapeUrl(process.env.ADMIN_URL || (process.env.NODE_ENV === 'production' ? 'https://admin.zzscale.com' : 'http://localhost:3001'));

    const subject = `[CC Scale] New Inquiry from ${inquiry.fullName}${inquiry.company ? ` (${inquiry.company})` : ''}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0A1628;">New Inquiry Received</h1>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Customer Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
          ${safePhone ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safePhone}</td></tr>` : ''}
          ${safeCompany ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Company:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeCompany}</td></tr>` : ''}
          ${safeCountry ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Country:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeCountry}</td></tr>` : ''}
        </table>
        ${itemList ? `<h3 style="margin-top: 20px;">Products Interested:</h3><ul>${itemList}</ul>` : ''}
        ${safeMessage}
        <p style="margin-top: 20px;">
          <a href="${safeAdminUrl}/inquiries" style="background: #ea580c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View in Admin Panel</a>
        </p>
      </div>
    `;
    await this.sendEmail(adminEmail, subject, html);
  }
}
