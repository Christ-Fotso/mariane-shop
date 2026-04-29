import { prisma } from '../db/prisma';
import { ProductEntity, ProductRepository } from '../../domain/repositories/ProductRepository';

export class PrismaProductRepository implements ProductRepository {
  async findAll(): Promise<ProductEntity[]> {
    return prisma.product.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return prisma.product.findUnique({
      where: { id }
    });
  }

  async create(data: Omit<ProductEntity, 'id'>): Promise<ProductEntity> {
    return prisma.product.create({
      data
    });
  }

  async update(id: string, data: Partial<Omit<ProductEntity, 'id'>>): Promise<ProductEntity> {
    return prisma.product.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id }
    });
  }
}
