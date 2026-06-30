import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    category?: string;
    isActive?: boolean;
    page: number;
    pageSize: number;
  }) {
    const { category, isActive, page, pageSize } = params;
    const safeSize = Math.min(100, Math.max(1, Math.floor(pageSize) || 20));
    const safePage = Math.max(1, Math.floor(page) || 1);
    const skip = (safePage - 1) * safeSize;

    const where: any = {};
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive;

    const [data, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: safeSize,
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    // Parse tags from JSON string for frontend consumption
    const parsed = data.map((post) => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
    }));

    return {
      data: parsed,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (!post) {
      throw new NotFoundException(`Blog post with slug '${slug}' not found`);
    }
    return {
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
    };
  }

  async findOne(id: number) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }
    return {
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
    };
  }

  async create(dto: CreateBlogPostDto) {
    const existing = await this.prisma.blogPost.findUnique({ where: { slug: dto.slug } });
    if (existing) {
      throw new ConflictException(`Blog post with slug '${dto.slug}' already exists`);
    }

    const data: any = { ...dto };
    if (dto.tags) {
      data.tags = JSON.stringify(dto.tags);
    }

    const post = await this.prisma.blogPost.create({
      data,
    });

    return {
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
    };
  }

  async update(id: number, dto: UpdateBlogPostDto) {
    await this.findOne(id);

    const data: any = { ...dto };
    if (dto.tags !== undefined) {
      data.tags = JSON.stringify(dto.tags);
    }

    const post = await this.prisma.blogPost.update({
      where: { id },
      data,
    });

    return {
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.blogPost.delete({ where: { id } });
  }

  async getCategories() {
    const posts = await this.prisma.blogPost.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });

    const categories = posts
      .map((p) => p.category)
      .filter((c): c is string => c !== null);

    return categories;
  }
}
