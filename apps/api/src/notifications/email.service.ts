import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
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

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"CC Scale" <noreply@ccscale.com>',
        to,
        subject,
        html,
      });
      console.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      // Don't throw - email failure shouldn't break the main flow
    }
  }

  async sendInquiryConfirmation(inquiry: {
    fullName: string;
    email: string;
    items?: Array<{ productNameEn?: string; productNameZh?: string; quantity?: number }>;
    message?: string;
  }): Promise<void> {
    const subject = 'Thank you for your inquiry - CC Scale';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0A1628;">Thank You for Your Inquiry!</h1>
        <p>Dear ${inquiry.fullName},</p>
        <p>We have received your inquiry and will get back to you within 24 hours.</p>
        ${inquiry.items && inquiry.items.length > 0 ? `
          <h3>Your Inquiry Details:</h3>
          <ul>
            ${inquiry.items.map(item => `
              <li>${item.productNameEn || item.productNameZh || 'Product'} - Qty: ${item.quantity || 1}</li>
            `).join('')}
          </ul>
        ` : ''}
        ${inquiry.message ? `<p><strong>Your Message:</strong><br/>${inquiry.message}</p>` : ''}
        <p>Best regards,<br/>CC Scale Team</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">
          CC Scale Co., Ltd.<br/>
          sales@ccscale.com | +86 123 4567 8900
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
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ccscale.com';
    const subject = `[CC Scale] New Inquiry from ${inquiry.fullName}${inquiry.company ? ` (${inquiry.company})` : ''}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0A1628;">New Inquiry Received</h1>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Customer Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${inquiry.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td>
          </tr>
          ${inquiry.phone ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${inquiry.phone}</td>
          </tr>
          ` : ''}
          ${inquiry.company ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Company:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${inquiry.company}</td>
          </tr>
          ` : ''}
          ${inquiry.country ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Country:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${inquiry.country}</td>
          </tr>
          ` : ''}
        </table>
        ${inquiry.items && inquiry.items.length > 0 ? `
          <h3 style="margin-top: 20px;">Products Interested:</h3>
          <ul>
            ${inquiry.items.map(item => `
              <li>${item.productNameEn || item.productNameZh || 'Product'} - Qty: ${item.quantity || 1}</li>
            `).join('')}
          </ul>
        ` : ''}
        ${inquiry.message ? `
          <h3 style="margin-top: 20px;">Message:</h3>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 4px;">${inquiry.message}</p>
        ` : ''}
        <p style="margin-top: 20px;">
          <a href="${process.env.ADMIN_URL || 'http://localhost:3001'}/inquiries" style="background: #ea580c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View in Admin Panel</a>
        </p>
      </div>
    `;
    await this.sendEmail(adminEmail, subject, html);
  }
}