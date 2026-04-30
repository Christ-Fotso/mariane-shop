'use server';

import { PrismaProductRepository } from '@/core/infrastructure/repositories/PrismaProductRepository';
import { CreateProductUseCase } from '@/core/application/use-cases/CreateProductUseCase';
import { validateImageFile } from '@/core/infrastructure/upload/validateImage';
import { verifyAdminAuth } from '@/core/infrastructure/auth/verifyAuth';
import { join, extname, basename } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { randomUUID } from 'crypto';
import { prisma } from '@/core/infrastructure/db/prisma';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

export async function createProduct(formData: FormData) {
  // 🔒 Server-side auth check (middleware only checks cookie presence)
  const admin = await verifyAdminAuth();
  if (!admin) {
    return { success: false, error: 'Non autorisé' };
  }

  try {
    const name = (formData.get('name') as string)?.trim();
    const description = (formData.get('description') as string)?.trim();
    const price = parseFloat(formData.get('price') as string);
    const quantity = parseInt(formData.get('quantity') as string, 10);
    const categoryId = (formData.get('categoryId') as string) || null;
    const imageFiles = formData.getAll('images') as File[];

    // Input validation
    if (!name || name.length > 200) {
      return { success: false, error: 'Nom de produit invalide (1-200 caractères).' };
    }
    if (isNaN(price) || price < 0) {
      return { success: false, error: 'Prix invalide.' };
    }
    if (isNaN(quantity) || quantity < 0) {
      return { success: false, error: 'Quantité invalide.' };
    }

    const nonEmptyFiles = imageFiles.filter((f) => f.size > 0);
    if (nonEmptyFiles.length === 0 || nonEmptyFiles.length > 4) {
      return { success: false, error: 'Veuillez sélectionner entre 1 et 4 images.' };
    }

    const imageUrls: string[] = [];
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    for (const file of nonEmptyFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 🔒 Validate file size AND real MIME type via magic bytes
      const validation = validateImageFile(file, buffer);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // 🔒 Strip original filename, generate safe name with allowed extension
      const originalExt = extname(basename(file.name)).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(originalExt)) {
        return { success: false, error: `Extension de fichier non autorisée: ${originalExt}` };
      }

      const filename = `${randomUUID()}${originalExt}`;
      await writeFile(join(uploadDir, filename), buffer);
      imageUrls.push(`/uploads/${filename}`);
    }

    const repository = new PrismaProductRepository();
    const useCase = new CreateProductUseCase(repository);

    await useCase.execute({
      name,
      description: description || null,
      price,
      quantity,
      images: imageUrls,
      brandId: null,
      categoryId,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Une erreur est survenue lors de la création.' };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const admin = await verifyAdminAuth();
  if (!admin) {
    return { success: false, error: 'Non autorisé' };
  }

  try {
    const name = (formData.get('name') as string)?.trim();
    const description = (formData.get('description') as string)?.trim();
    const price = parseFloat(formData.get('price') as string);
    const quantity = parseInt(formData.get('quantity') as string, 10);
    const categoryId = (formData.get('categoryId') as string) || null;
    const imageFiles = formData.getAll('images') as File[];

    if (!name || name.length > 200) {
      return { success: false, error: 'Nom de produit invalide (1-200 caractères).' };
    }
    if (isNaN(price) || price < 0) {
      return { success: false, error: 'Prix invalide.' };
    }
    if (isNaN(quantity) || quantity < 0) {
      return { success: false, error: 'Quantité invalide.' };
    }

    // Get existing product to preserve current images if no new ones uploaded
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: 'Produit introuvable.' };
    }

    let imageUrls: string[] = existing.images;
    const nonEmptyFiles = imageFiles.filter((f) => f.size > 0);

    if (nonEmptyFiles.length > 0) {
      if (nonEmptyFiles.length > 4) {
        return { success: false, error: 'Maximum 4 images autorisées.' };
      }

      imageUrls = [];
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      for (const file of nonEmptyFiles) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const validation = validateImageFile(file, buffer);
        if (!validation.valid) {
          return { success: false, error: validation.error };
        }

        const originalExt = extname(basename(file.name)).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(originalExt)) {
          return { success: false, error: `Extension non autorisée: ${originalExt}` };
        }

        const filename = `${randomUUID()}${originalExt}`;
        await writeFile(join(uploadDir, filename), buffer);
        imageUrls.push(`/uploads/${filename}`);
      }
    }

    await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || null,
        price,
        quantity,
        images: imageUrls,
        categoryId: categoryId || null,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { success: false, error: 'Une erreur est survenue lors de la modification.' };
  }
}

