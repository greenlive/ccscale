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

  async findRelated(productId: number, limit: number = 4) {
    // Get the current product to find its category
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });

    if (!currentProduct) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Try to find products in the same category first
    const relatedFromCategory = await prisma.product.findMany({
      where: {
        categoryId: currentProduct.categoryId,
        isActive: true,
        id: { not: productId },
      },
      include: {
        category: true,
        images: true,
      },
      take: limit,
      orderBy: { order: 'asc' },
    });

    // If we don't have enough from same category, fill with random products
    if (relatedFromCategory.length < limit) {
      const additionalCount = limit - relatedFromCategory.length;
      const existingIds = [
        productId,
        ...relatedFromCategory.map((p) => p.id),
      ];

      const additionalProducts = await prisma.product.findMany({
        where: {
          isActive: true,
          id: { notIn: existingIds },
        },
        include: {
          category: true,
          images: true,
        },
        take: additionalCount,
        orderBy: { createdAt: 'desc' },
      });

      return [...relatedFromCategory, ...additionalProducts];
    }

    return relatedFromCategory;
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
    const { specs, images, mainImages, detailImages, videos, ...productData } = createProductDto;

    return prisma.product.create({
      data: {
        ...productData,
        ...(specs && {
          specs: {
            create: specs,
          },
        }),
        ...(images && images.length > 0 && {
          images: {
            create: images,
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
    const { specs, images, mainImages, detailImages, videos, ...data } = updateProductDto;

    // First check if product exists
    await this.findOne(id);

    // Delete existing images first
    if (images && images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
    }

    // Build update data
    const data: any = { ...data };

    if (specs && specs.length > 0) {
      data.specs = {
        deleteMany: {},
        create: specs.map((spec, idx) => ({
          keyEn: spec.keyEn,
          keyZh: spec.keyZh,
          valueEn: spec.valueEn,
          valueZh: spec.valueZh,
          order: spec.order ?? idx,
        })),
      };
    }

    if (images && images.length > 0) {
      data.images = {
        create: images.map(img => ({
          imageUrl: img.imageUrl,
          type: img.type || 'MAIN',
          altEn: img.altEn,
          altZh: img.altZh,
          order: img.order ?? 0,
          isMain: img.isMain ?? false,
        })),
      };
    }

    return prisma.product.update({
      where: { id },
      data: data,
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
