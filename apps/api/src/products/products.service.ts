import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

export interface ProductRow {
  sku: string;
  name_en: string;
  name_zh: string;
  slug: string;
  category_slug: string;
  price_min?: string;
  price_max?: string;
  moq?: string;
  lead_time?: string;
  is_active?: string;
  main_images?: string;
  detail_images?: string;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  total: number;
  imported: number;
  updated: number;
  failed: number;
  errors: ImportError[];
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    categoryId?: number,
    isActive: boolean = true,
    page: number = 1,
    pageSize: number = 20,
  ) {
    const safePage = Math.max(1, Math.floor(page));
    const safeSize = Math.min(100, Math.max(1, Math.floor(pageSize)));
    const skip = (safePage - 1) * safeSize;
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { ...(categoryId && { categoryId }), isActive },
        include: { category: true, images: true, specs: true },
        orderBy: { order: 'asc' },
        skip,
        take: safeSize,
      }),
      this.prisma.product.count({
        where: { ...(categoryId && { categoryId }), isActive },
      }),
    ]);
    return {
      data,
      total,
      page: safePage,
      pageSize: safeSize,
      totalPages: Math.ceil(total / safeSize),
    };
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
    const currentProduct = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });

    if (!currentProduct) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

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

    if (relatedFromCategory.length < limit) {
      const additionalCount = limit - relatedFromCategory.length;
      const existingIds = [productId, ...relatedFromCategory.map((p) => p.id)];

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

    await this.findOne(id);

    const data: any = {
      ...restData,
      ...(mainImages !== undefined && { mainImages: mainImages || null }),
      ...(detailImages !== undefined && { detailImages: detailImages || null }),
      ...(videos !== undefined && { videos: videos || null }),
    };

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

  // Batch import products from CSV
  async batchImport(csvContent: string): Promise<ImportResult> {
    const rows = this.parseCSV(csvContent);
    
    let imported = 0;
    let updated = 0;
    let failed = 0;
    const errors: ImportError[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2;

      try {
        if (!row.sku || !row.name_en || !row.name_zh || !row.slug || !row.category_slug) {
          errors.push({
            row: rowNumber,
            field: 'required',
            message: 'Missing required fields: sku, name_en, name_zh, slug, category_slug'
          });
          failed++;
          continue;
        }

        const category = await this.prisma.productCategory.findFirst({
          where: { slug: row.category_slug }
        });

        if (!category) {
          errors.push({
            row: rowNumber,
            field: 'category_slug',
            message: `Category not found: ${row.category_slug}`
          });
          failed++;
          continue;
        }

        const existingProduct = await this.prisma.product.findFirst({
          where: {
            OR: [{ sku: row.sku }, { slug: row.slug }]
          }
        });

        const productData: any = {
          sku: row.sku,
          nameEn: row.name_en,
          nameZh: row.name_zh,
          slug: row.slug,
          categoryId: category.id,
          priceMin: row.price_min ? parseFloat(row.price_min) : null,
          priceMax: row.price_max ? parseFloat(row.price_max) : null,
          moq: row.moq ? parseInt(row.moq) : null,
          leadTime: row.lead_time || null,
          isActive: row.is_active !== '0',
        };

        let productId: number;

        if (existingProduct) {
          await this.prisma.product.update({
            where: { id: existingProduct.id },
            data: productData
          });
          productId = existingProduct.id;
          updated++;
        } else {
          const product = await this.prisma.product.create({
            data: productData
          });
          productId = product.id;
          imported++;
        }

        // Handle main images
        if (row.main_images) {
          await this.prisma.productImage.deleteMany({
            where: { productId, isMain: true }
          });
          
          const mainImageUrls = row.main_images.split(',').map(url => url.trim()).filter(Boolean);
          for (let j = 0; j < mainImageUrls.length; j++) {
            await this.prisma.productImage.create({
              data: {
                productId,
                imageUrl: mainImageUrls[j],
                isMain: j === 0,
                type: 'MAIN'
              }
            });
          }
        }

        // Handle detail images
        if (row.detail_images) {
          await this.prisma.productImage.deleteMany({
            where: { productId, isMain: false }
          });
          
          const detailImageUrls = row.detail_images.split(',').map(url => url.trim()).filter(Boolean);
          for (const url of detailImageUrls) {
            await this.prisma.productImage.create({
              data: {
                productId,
                imageUrl: url,
                isMain: false,
                type: 'DETAIL'
              }
            });
          }
        }

      } catch (rowError) {
        errors.push({
          row: rowNumber,
          field: 'unknown',
          message: rowError instanceof Error ? rowError.message : 'Unknown error'
        });
        failed++;
      }
    }

    return {
      success: failed === 0,
      message: failed === 0 ? 'Import completed successfully' : `Import completed with ${failed} errors`,
      total: rows.length,
      imported,
      updated,
      failed,
      errors: errors.slice(0, 50)
    };
  }

  private parseCSV(content: string): ProductRow[] {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows: ProductRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row as ProductRow);
    }

    return rows;
  }

  /** Sanitize a CSV cell value to prevent spreadsheet formula injection. */
  private sanitizeCell(value: string): string {
    const trimmed = value.trim();
    if (trimmed.length === 0) return trimmed;
    const firstChar = trimmed[0];
    if ("=+-@/`![\"".includes(firstChar)) {
      return "'" + trimmed;
    }
    return trimmed;
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(this.sanitizeCell(current));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
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
