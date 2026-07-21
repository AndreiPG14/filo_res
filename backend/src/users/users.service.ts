import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.user.findMany({ select: { id: true, name: true, email: true, phone: true, profile: true, status: true, createdAt: true } }); }
  findOne(id: number) { return this.prisma.user.findUnique({ where: { id } }); }
  async create(data: any) {
    const hashed = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({ data: { ...data, password: hashed } });
  }
  async update(id: number, data: any) {
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    else delete data.password;
    return this.prisma.user.update({ where: { id }, data });
  }
  remove(id: number) { return this.prisma.user.delete({ where: { id } }); }
}
