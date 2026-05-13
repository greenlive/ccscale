import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DownloadsService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string, isActive: boolean = true) {
    return this.prisma.download.findMany({
      where: {
        ...(category && { category }),
        ...(isActive !== undefined && { isActive }),
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(id: number) {
    const download = await this.prisma.download.findUnique({
      where: { id },
    });

    if (!download) {
      throw new NotFoundException(`Download with ID ${id} not found`);
    }

    return download;
  }

  async create(data: {
    titleEn: string;
    titleZh: string;
    descriptionEn?: string;
    descriptionZh?: string;
    fileUrl: string;
    fileType: string;
    fileSize?: number;
    category?: string;
    order?: number;
  }) {
    return this.prisma.download.create({
      data: {
        titleEn: data.titleEn,
        titleZh: data.titleZh,
        descriptionEn: data.descriptionEn,
        descriptionZh: data.descriptionZh,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        fileSize: data.fileSize,
        category: data.category,
        order: data.order || 0,
      },
    });
  }

  async update(
    id: number,
    data: {
      titleEn?: string;
      titleZh?: string;
      descriptionEn?: string;
      descriptionZh?: string;
      fileUrl?: string;
      fileType?: string;
      fileSize?: number;
      category?: string;
      order?: number;
      isActive?: boolean;
    },
  ) {
    await this.findOne(id);

    return this.prisma.download.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.download.delete({
      where: { id },
    });
  }

  async incrementDownloadCount(id: number) {
    await this.findOne(id);

    return this.prisma.download.update({
      where: { id },
      data: {
        downloadCount: { increment: 1 },
      },
    });
  }
}