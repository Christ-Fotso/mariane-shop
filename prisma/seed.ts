/**
 * Prisma seed script — creates the initial admin account.
 * Run with: npx prisma db seed
 * Or automatically via: docker compose (migrator service)
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const username = 'kengnemariane01@gmail.com';
  const password = 'dolipranehope2K26';
  const password_hash = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { username },
    update: {},
    create: { username, password_hash },
  });

  console.log(`✅ Admin créé : ${admin.username} (id: ${admin.id})`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
