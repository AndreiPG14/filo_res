const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

require('dotenv').config();
const connectionString = process.env.DATABASE_URL.replace('sslmode=require', 'sslmode=no-verify');
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const pw = await bcrypt.hash('admin123', 10);
  const u1 = await prisma.user.create({
    data: { name: 'Andrei Perez', email: 'andrei@gmail.com', phone: '980735740', profile: 'ADMIN', status: 'ACTIVE', password: pw }
  });
  const u2 = await prisma.user.create({
    data: { name: 'Marlon Castillo', email: 'marlon@gmail.com', phone: '987654321', profile: 'ADMIN', status: 'ACTIVE', password: pw }
  });
  console.log('Usuarios creados:', u1.email, u2.email);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e.message); process.exit(1); });
