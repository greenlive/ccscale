import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageContentDto, UpdatePageContentDto } from './dto/page-content.dto';

@Injectable()
export class PageContentService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pageContent.findMany({
      orderBy: { pageKey: 'asc' },
    });
  }

  async findByKey(pageKey: string) {
    const content = await this.prisma.pageContent.findUnique({
      where: { pageKey },
    });

    if (!content) {
      throw new NotFoundException(`Page content with key '${pageKey}' not found`);
    }

    return content;
  }

  async findByKeys(pageKeys: string[]) {
    return this.prisma.pageContent.findMany({
      where: { pageKey: { in: pageKeys } },
    });
  }

  async create(createDto: CreatePageContentDto) {
    return this.prisma.pageContent.create({
      data: createDto,
    });
  }

  async upsert(createDto: CreatePageContentDto) {
    return this.prisma.pageContent.upsert({
      where: { pageKey: createDto.pageKey },
      update: {
        titleEn: createDto.titleEn,
        titleZh: createDto.titleZh,
        contentEn: createDto.contentEn,
        contentZh: createDto.contentZh,
        metaEn: createDto.metaEn,
        metaZh: createDto.metaZh,
      },
      create: createDto,
    });
  }

  async update(pageKey: string, updateDto: UpdatePageContentDto) {
    await this.findByKey(pageKey);

    return this.prisma.pageContent.update({
      where: { pageKey },
      data: updateDto,
    });
  }

  async delete(pageKey: string) {
    await this.findByKey(pageKey);

    return this.prisma.pageContent.delete({
      where: { pageKey },
    });
  }
}