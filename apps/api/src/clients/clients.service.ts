import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

@Injectable()
export class ClientsService {
  async findAll(isActive?: boolean) {
    return prisma.client.findMany({
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
    const client = await prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async create(createClientDto: CreateClientDto) {
    return prisma.client.create({
      data: createClientDto,
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    await this.findOne(id);

    return prisma.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return prisma.client.delete({
      where: { id },
    });
  }

  async getStats() {
    const [total, active] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({ where: { isActive: true } }),
    ]);

    return { total, active };
  }
}
