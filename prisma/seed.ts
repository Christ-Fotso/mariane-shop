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

  // Create mock products
  const products = [
    { name: "Sac à main Élégance", description: "Sac en cuir véritable avec finitions dorées.", price: 25000, images: ["https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&auto=format&fit=crop&q=60"] },
    { name: "Robe de soirée Velours", description: "Magnifique robe longue pour vos soirées chics.", price: 35000, images: ["https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&auto=format&fit=crop&q=60"] },
    { name: "Montre Or & Diamants (Imitation)", description: "Une touche de luxe pour votre poignet.", price: 15000, images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&auto=format&fit=crop&q=60"] },
    { name: "Escarpins Noirs Classiques", description: "L'indispensable de votre garde-robe.", price: 20000, images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=60"] },
    { name: "Palette de Maquillage Pro", description: "Des couleurs vibrantes pour un look parfait.", price: 12000, images: ["https://images.unsplash.com/photo-1512496115841-db0aaf4e056?w=500&auto=format&fit=crop&q=60"] },
    { name: "Parfum Séduction", description: "Fragrance florale et boisée, tenue longue durée.", price: 45000, images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=60"] }
  ];

  for (const p of products) {
    await prisma.product.create({
      data: p
    });
  }
  console.log('✅ Produits fictifs ajoutés avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
