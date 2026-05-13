import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(categoryId?: number, isActive: boolean = true) {
    return this.prisma.product.findMany({
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
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        specs: true,
        customerCases: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        specs: true,
        customerCases: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  async findRelated(productId: number, limit: number = 4) {
    // Get the current product to find its category
    const currentProduct = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });

    if (!currentProduct) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Try to find products in the same category first
    const relatedFromCategory = await this.prisma.product.findMany({
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

      const additionalProducts = await this.prisma.product.findMany({
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
    return this.prisma.productCategory.findMany({
      where: { isActive },
      include: {
        products: {
          where: { isActive },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async search(params: {
    q?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page: number;
    pageSize: number;
  }) {
    const { q, categoryId, minPrice, maxPrice, sortBy, sortOrder, page, pageSize } = params;
    const skip = (page - 1) * pageSize;

    const where: any = { isActive: true };

    if (q) {
      where.OR = [
        { nameEn: { contains: q, mode: 'insensitive' } },
        { nameZh: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.priceMin = {};
      if (minPrice !== undefined) where.priceMin.gte = minPrice;
      if (maxPrice !== undefined) where.priceMin.lte = maxPrice;
    }

    const orderBy: any = {};
    if (sortBy && ['nameEn', 'nameZh', 'priceMin', 'priceMax', 'createdAt', 'order'].includes(sortBy)) {
      orderBy[sortBy] = sortOrder || 'asc';
    } else {
      orderBy.order = 'asc';
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          images: true,
          specs: true,
        },
        orderBy,
        skip,
        take: pageSize,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async create(createProductDto: CreateProductDto) {
    const { specs, images, mainImages, detailImages, videos, ...productData } = createProductDto;

    return this.prisma.product.create({
      data: {
        ...productData,
        mainImages: mainImages ?? null,
        detailImages: detailImages ?? null,
        videos: videos ?? null,
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
    const { specs, images, mainImages, detailImages, videos, ...restData } = updateProductDto;

    // First check if product exists
    await this.findOne(id);

    // Build update data
    const data: any = {
      ...restData,
      ...(mainImages !== undefined && { mainImages: mainImages || null }),
      ...(detailImages !== undefined && { detailImages: detailImages || null }),
      ...(videos !== undefined && { videos: videos || null }),
    };

    // Clear old productImage table when updating with new image fields
    if (mainImages !== undefined || detailImages !== undefined) {
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
    }

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

    return this.prisma.product.update({
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
    return this.prisma.product.delete({ where: { id } });
  }

  // Category methods
  async findCategoryById(id: number) {
    const category = await this.prisma.productCategory.findUnique({
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
    return this.prisma.productCategory.create({
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
    return this.prisma.productCategory.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: number) {
    await this.findCategoryById(id);
    return this.prisma.productCategory.delete({ where: { id } });
  }
}
