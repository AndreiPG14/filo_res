import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.pedido.findMany({ include: { mesa: true, detalles: true }, orderBy: { createdAt: 'desc' } }); }
  findOne(id: number) { return this.prisma.pedido.findUnique({ where: { id }, include: { mesa: true, detalles: true } }); }
  async create(data: any) {
    const { detalles, ...pedido } = data;
    const result = await this.prisma.pedido.create({ data: { ...pedido, detalles: { create: detalles } }, include: { mesa: true, detalles: true } });
    await this.prisma.mesa.update({ where: { id: pedido.mesaId }, data: { estado: 'ocupada' } });
    // Descontar stock y detectar alertas
    console.log('[PEDIDO] detalles recibidos:', JSON.stringify(detalles));
    const alertas: { name: string; stock: number }[] = [];
    for (const d of detalles) {
      console.log(`[PEDIDO] detalle: productId=${d.productId}, cantidad=${d.cantidad}`);
      if (d.productId) {
        const updated = await this.prisma.product.update({
          where: { id: d.productId },
          data: { stock: { decrement: d.cantidad } },
        });
        console.log(`[PEDIDO] ${updated.name}: stock=${updated.stock}, alerts=${updated.alerts}, bajo=${updated.stock <= updated.alerts}`);
        if (updated.stock <= updated.alerts) {
          alertas.push({ name: updated.name, stock: updated.stock });
        }
      } else {
        console.log(`[PEDIDO] detalle sin productId, se omite descuento`);
      }
    }
    console.log('[PEDIDO] alertasStock:', JSON.stringify(alertas));
    return { ...result, alertasStock: alertas };
  }
  async update(id: number, data: any) {
    const result = await this.prisma.pedido.update({ where: { id }, data, include: { mesa: true, detalles: true } });
    if (data.estado === 'ENTREGADO') {
      await this.prisma.mesa.update({ where: { id: result.mesaId }, data: { estado: 'libre' } });
    }
    return result;
  }
  async remove(id: number) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id } });
    await this.prisma.pedidoDetalle.deleteMany({ where: { pedidoId: id } });
    await this.prisma.pedido.delete({ where: { id } });
    if (pedido) {
      const otros = await this.prisma.pedido.count({
        where: { mesaId: pedido.mesaId, estado: { notIn: ['ENTREGADO', 'CANCELADO'] } }
      });
      if (otros === 0) await this.prisma.mesa.update({ where: { id: pedido.mesaId }, data: { estado: 'libre' } });
    }
  }
}
