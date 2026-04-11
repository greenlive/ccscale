import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

@Injectable()
export class ProductsService {
  async findAll(categoryId?: number, isActive: boolean = true) {
    return prisma.product.findMany({
      where: {
        ...(categoryId && { categoryId }),
        isActive,
      },
      include: {
        category: true,
        images: true,
        specs: true,
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        specs: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        specs: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  async findCategories(isActive: boolean = true) {
    return prisma.productCategory.findMany({
      where: { isActive },
      include: {
        products: {
          where: { isActive },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async create(createProductDto: CreateProductDto) {
    const { specs, ...productData } = createProductDto;

    return prisma.product.create({
      data: {
        ...productData,
        ...(specs && {
          specs: {
            create: specs,
          },
        }),
      },
      include: {
        category: true,
        images: true,
        specs: true,
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { specs, ...productData } = updateProductDto;

    // First check if product exists
    await this.findOne(id);

    return prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(specs && {
          specs: {
            deleteMany: {},
            create: specs,
          },
        }),
      },
      include: {
        category: true,
        images: true,
        specs: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return prisma.product.delete({ where: { id } });
  }

  // Category methods
  async findCategoryById(id: number) {
    const category = await prisma.productCategory.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
        },
      },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async createCategory(data: {
    nameEn: string;
    nameZh: string;
    slug: string;
    descriptionEn?: string;
    descriptionZh?: string;
    imageUrl?: string;
    order?: number;
  }) {
    return prisma.productCategory.create({
      data: {
        nameEn: data.nameEn,
        nameZh: data.nameZh,
        slug: data.slug,
        descriptionEn: data.descriptionEn,
        descriptionZh: data.descriptionZh,
        imageUrl: data.imageUrl,
        order: data.order || 0,
      },
    });
  }

  async updateCategory(
    id: number,
    data: {
      nameEn?: string;
      nameZh?: string;
      slug?: string;
      descriptionEn?: string;
      descriptionZh?: string;
      imageUrl?: string;
      order?: number;
      isActive?: boolean;
    },
  ) {
    await this.findCategoryById(id);
    return prisma.productCategory.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: number) {
    await this.findCategoryById(id);
    return prisma.productCategory.delete({ where: { id } });
  }
}
