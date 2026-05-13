import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async findAll(isActive?: boolean) {
    return this.prisma.testimonial.findMany({
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
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }

    return testimonial;
  }

  async create(createTestimonialDto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({
      data: createTestimonialDto,
    });
  }

  async update(id: number, updateTestimonialDto: UpdateTestimonialDto) {
    await this.findOne(id);

    return this.prisma.testimonial.update({
      where: { id },
      data: updateTestimonialDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.testimonial.delete({
      where: { id },
    });
  }

  async getStats() {
    const [total, active] = await Promise.all([
      this.prisma.testimonial.count(),
      this.prisma.testimonial.count({ where: { isActive: true } }),
    ]);

    return { total, active };
  }
}
