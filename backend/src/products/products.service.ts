import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.product.findMany({ include: { category: true }, orderBy: { name: 'asc' } }); }
  findOne(id: number) { return this.prisma.product.findUnique({ where: { id }, include: { category: true, presas: true } }); }
  create(data: any) { return this.prisma.product.create({ data, include: { category: true } }); }
  update(id: number, data: any) { return this.prisma.product.update({ where: { id }, data, include: { category: true } }); }
  async remove(id: number) {
    const enUso = await this.prisma.saleDetail.count({ where: { productId: id } });
    if (enUso > 0) {
      throw new BadRequestException('Este producto tiene ventas registradas y no puede eliminarse');
    }
    await this.prisma.pedidoDetalle.updateMany({ where: { productId: id }, data: { productId: null } });
    await this.prisma.productPresa.deleteMany({ where: { productId: id } });
    return this.prisma.product.delete({ where: { id } });
  }
}
