import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

@Injectable()
export class DownloadsService {
  async findAll(category?: string, isActive: boolean = true) {
    return prisma.download.findMany({
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
    const download = await prisma.download.findUnique({
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
    return prisma.download.create({
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

    return prisma.download.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return prisma.download.delete({
      where: { id },
    });
  }

  async incrementDownloadCount(id: number) {
    await this.findOne(id);

    return prisma.download.update({
      where: { id },
      data: {
        downloadCount: { increment: 1 },
      },
    });
  }
}