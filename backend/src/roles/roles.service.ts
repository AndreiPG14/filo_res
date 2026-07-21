import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.$queryRaw`SELECT id, name FROM roles ORDER BY name`; }
  create(name: string) { return this.prisma.$executeRaw`INSERT INTO roles (name, guard_name, created_at, updated_at) VALUES (${name}, 'web', NOW(), NOW())`; }
  update(id: number, name: string) { return this.prisma.$executeRaw`UPDATE roles SET name=${name}, updated_at=NOW() WHERE id=${id}`; }
  remove(id: number) { return this.prisma.$executeRaw`DELETE FROM roles WHERE id=${id}`; }
}
