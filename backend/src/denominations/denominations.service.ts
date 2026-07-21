import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DenominationsService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.denomination.findMany({ orderBy: { value: 'asc' } }); }
  create(data: any) { return this.prisma.denomination.create({ data }); }
  update(id: number, data: any) { return this.prisma.denomination.update({ where: { id }, data }); }
  remove(id: number) { return this.prisma.denomination.delete({ where: { id } }); }
}
