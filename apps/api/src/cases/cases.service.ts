import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaseDto, UpdateCaseDto } from './dto/case.dto';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { isActive?: boolean; page: number; pageSize: number }) {
    const { isActive, page, pageSize } = params;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive;

    const [data, total] = await Promise.all([
      this.prisma.customerCase.findMany({
        where,
        include: {
          product: {
            select: { id: true, nameEn: true, nameZh: true, slug: true },
          },
        },
        orderBy: { order: 'asc' },
        skip,
        take: pageSize,
      }),
      this.prisma.customerCase.count({ where }),
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
    const item = await this.prisma.customerCase.findUnique({
      where: { id },
      include: {
        product: {
          select: { id: true, nameEn: true, nameZh: true, slug: true },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }

    return item;
  }

  async findByProduct(productId: number, isActive?: boolean) {
    const where: any = { productId };
    if (isActive !== undefined) where.isActive = isActive;

    return this.prisma.customerCase.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async create(dto: CreateCaseDto) {
    return this.prisma.customerCase.create({
      data: dto,
      include: {
        product: {
          select: { id: true, nameEn: true, nameZh: true, slug: true },
        },
      },
    });
  }

  async update(id: number, dto: UpdateCaseDto) {
    await this.findOne(id);

    return this.prisma.customerCase.update({
      where: { id },
      data: dto,
      include: {
        product: {
          select: { id: true, nameEn: true, nameZh: true, slug: true },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.customerCase.delete({ where: { id } });
  }

  async getStats() {
    const [total, active] = await Promise.all([
      this.prisma.customerCase.count(),
      this.prisma.customerCase.count({ where: { isActive: true } }),
    ]);

    return { total, active };
  }
}
