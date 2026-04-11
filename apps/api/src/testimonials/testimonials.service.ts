import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

@Injectable()
export class TestimonialsService {
  async findAll(isActive?: boolean) {
    return prisma.testimonial.findMany({
      where: {
        ...(isActive !== undefined && { isActive }),
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(id: number) {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }

    return testimonial;
  }

  async create(createTestimonialDto: CreateTestimonialDto) {
    return prisma.testimonial.create({
      data: createTestimonialDto,
    });
  }

  async update(id: number, updateTestimonialDto: UpdateTestimonialDto) {
    await this.findOne(id);

    return prisma.testimonial.update({
      where: { id },
      data: updateTestimonialDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return prisma.testimonial.delete({
      where: { id },
    });
  }

  async getStats() {
    const [total, active] = await Promise.all([
      prisma.testimonial.count(),
      prisma.testimonial.count({ where: { isActive: true } }),
    ]);

    return { total, active };
  }
}
