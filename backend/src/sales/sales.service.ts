import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}
  findAll(from?: string, to?: string) {
    const where: any = {};
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to + 'T23:59:59');
    }
    return this.prisma.sale.findMany({ where, include: { user: true, details: { include: { product: true } } }, orderBy: { createdAt: 'desc' } });
  }
  create(data: any, userId: number) {
    const { details, ...sale } = data;
    return this.prisma.sale.create({
      data: { ...sale, userId, details: { create: details } },
      include: { user: true, details: true },
    });
  }
}
