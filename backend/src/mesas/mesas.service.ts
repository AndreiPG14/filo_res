import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MesasService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.mesa.findMany({ orderBy: { nombre: 'asc' } }); }
  findOne(id: number) { return this.prisma.mesa.findUnique({ where: { id } }); }
  create(data: any) { return this.prisma.mesa.create({ data }); }
  update(id: number, data: any) { return this.prisma.mesa.update({ where: { id }, data }); }
  remove(id: number) { return this.prisma.mesa.delete({ where: { id } }); }
}
