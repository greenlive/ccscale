import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto, UpdateInquiryDto, CreateActivityLogDto } from './dto/inquiry.dto';
import { EmailService } from '../notifications/email.service';

@Injectable()
export class InquiriesService {
  constructor(
    private readonly emailService: EmailService,
    private prisma: PrismaService,
  ) {}

  async findAll(status?: string, page: number = 1, pageSize: number = 20) {
    page = Math.max(1, Math.floor(page));
    pageSize = Math.min(100, Math.max(1, Math.floor(pageSize)));
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        where: {
          ...(status && { status }),
        },
        include: {
          items: true,
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          activities: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.inquiry.count({
        where: {
          ...(status && { status }),
        },
      }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: number) {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
      include: {
        items: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!inquiry) {
      throw new NotFoundException(`Inquiry with ID ${id} not found`);
    }

    return inquiry;
  }

  async create(createInquiryDto: CreateInquiryDto, ipAddress?: string, userAgent?: string) {
    const { items, ...inquiryData } = createInquiryDto;

    // Transform items to Prisma-compatible Decimal values
    const transformedItems = items?.map((item) => ({
      ...item,
      unitPrice: item.unitPrice,
    }));

    const inquiry = await this.prisma.inquiry.create({
      data: {
        ...inquiryData,
        ipAddress,
        userAgent,
        status: 'NEW',
        ...(transformedItems && {
          items: {
            create: transformedItems,
          },
        }),
      },
      include: {
        items: true,
      },
    });

    // 创建初始活动日志
    await this.createActivityLog({
      inquiryId: inquiry.id,
      action: 'CREATED',
      detail: '询盘已创建',
      performedBy: 'System',
    });

    // Send confirmation email to customer
    try {
      await this.emailService.sendInquiryConfirmation({
        fullName: inquiry.fullName,
        email: inquiry.email,
        items: inquiry.items.map(item => ({
          productNameEn: item.productNameEn || undefined,
          productNameZh: item.productNameZh || undefined,
          quantity: item.quantity || undefined,
        })),
        message: inquiry.message,
      });

      // Send notification to admin
      await this.emailService.sendNewInquiryNotificationToAdmin({
        fullName: inquiry.fullName,
        email: inquiry.email,
        phone: inquiry.phone || undefined,
        company: inquiry.company || undefined,
        country: inquiry.country || undefined,
        message: inquiry.message,
        items: inquiry.items.map(item => ({
          productNameEn: item.productNameEn || undefined,
          productNameZh: item.productNameZh || undefined,
          quantity: item.quantity || undefined,
        })),
      });
    } catch (error) {
      console.error('Failed to send inquiry emails:', error);
      // Don't throw - the inquiry was created successfully
    }

    return inquiry;
  }

  async update(id: number, updateInquiryDto: UpdateInquiryDto) {
    // First check if inquiry exists
    const oldInquiry = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!oldInquiry) {
      throw new NotFoundException(`Inquiry with ID ${id} not found`);
    }

    const { repliedAt, repliedBy, replyMethod, closedReason, ...rest } = updateInquiryDto;

    // 构建更新数据
    const updateData: any = { ...rest };

    // 如果有回复信息，设置回复字段
    if (replyMethod) {
      updateData.replyMethod = replyMethod;
      updateData.repliedAt = repliedAt ? new Date(repliedAt) : new Date();
      updateData.repliedBy = repliedBy || 'Admin';
    }

    // 如果有关闭原因
    if (closedReason !== undefined) {
      updateData.closedReason = closedReason;
    }

    // 状态变更时自动记录日志
    if (updateInquiryDto.status && updateInquiryDto.status !== oldInquiry.status) {
      const statusLabels: Record<string, string> = {
        NEW: '新询盘',
        READ: '已读',
        IN_PROGRESS: '处理中',
        REPLIED: '已回复',
        CLOSED: '已关闭',
        SPAM: '垃圾',
      };
      const oldLabel = statusLabels[oldInquiry.status] || oldInquiry.status;
      const newLabel = statusLabels[updateInquiryDto.status] || updateInquiryDto.status;

      await this.createActivityLog({
        inquiryId: id,
        action: 'STATUS_CHANGE',
        detail: `${oldLabel} → ${newLabel}`,
        performedBy: repliedBy || 'Admin',
      });
    }

    // 如果设置了回复方式，记录回复日志
    if (replyMethod) {
      const methodLabels: Record<string, string> = {
        EMAIL: '邮件',
        WHATSAPP: 'WhatsApp',
        PHONE: '电话',
        ALIBABA: 'Alibaba',
        LINKEDIN: 'LinkedIn',
        OTHER: '其他',
      };
      await this.createActivityLog({
        inquiryId: id,
        action: 'REPLIED',
        detail: `通过 ${methodLabels[replyMethod] || replyMethod} 回复`,
        performedBy: repliedBy || 'Admin',
      });
    }

    return this.prisma.inquiry.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        assignedTo: true,
        activities: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  // 活动日志相关方法
  async createActivityLog(dto: CreateActivityLogDto) {
    return this.prisma.activityLog.create({
      data: {
        inquiryId: dto.inquiryId,
        action: dto.action,
        detail: dto.detail,
        performedBy: dto.performedBy || 'System',
      },
    });
  }

  async getActivityLogs(inquiryId: number) {
    return this.prisma.activityLog.findMany({
      where: { inquiryId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const [total, newCount, inProgress, replied, closed] = await Promise.all([
      this.prisma.inquiry.count(),
      this.prisma.inquiry.count({ where: { status: 'NEW' } }),
      this.prisma.inquiry.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.inquiry.count({ where: { status: 'REPLIED' } }),
      this.prisma.inquiry.count({ where: { status: 'CLOSED' } }),
    ]);

    return {
      total,
      new: newCount,
      inProgress,
      replied,
      closed,
    };
  }

  async delete(id: number) {
    const inquiry = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) {
      throw new NotFoundException(`Inquiry with ID ${id} not found`);
    }
    return this.prisma.inquiry.delete({ where: { id } });
  }

  // 添加联系尝试记录
  async addContactAttempt(inquiryId: number, method: string, success: boolean, performedBy: string) {
    const methodLabels: Record<string, string> = {
      EMAIL: '邮件',
      WHATSAPP: 'WhatsApp',
      PHONE: '电话',
      ALIBABA: 'Alibaba',
      LINKEDIN: 'LinkedIn',
      OTHER: '其他',
    };
    const label = methodLabels[method] || method;
    const resultText = success ? `✓ ${label}联系成功` : `✗ ${label}联系失败`;

    // 创建联系尝试活动记录
    const activity = await this.prisma.activityLog.create({
      data: {
        inquiryId,
        action: 'CONTACT_ATTEMPT',
        detail: resultText,
        performedBy: performedBy || 'Admin',
      },
    });

    // 如果标记为成功，更新询盘状态为已回复
    if (success) {
      await this.prisma.inquiry.update({
        where: { id: inquiryId },
        data: {
          status: 'REPLIED',
          repliedAt: new Date(),
          replyMethod: method as any,
        },
      });
    }

    return activity;
  }
}