import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'andrei@gmail.com' },
    update: {},
    create: { name: 'Andrei Perez', email: 'andrei@gmail.com', phone: '980735740', profile: 'ADMIN', status: 'ACTIVE', password },
  });
  await prisma.user.upsert({
    where: { email: 'marlon@gmail.com' },
    update: {},
    create: { name: 'Marlon Castillo', email: 'marlon@gmail.com', phone: '987654321', profile: 'ADMIN', status: 'ACTIVE', password: await bcrypt.hash('admin123', 10) },
  });
  console.log('✅ Usuarios creados');
}

main().catch(console.error).finally(() => prisma.$disconnect());
