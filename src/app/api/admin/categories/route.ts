import { NextResponse } from 'next/server';
import { prisma } from '@/core/infrastructure/db/prisma';
import { verifyAdminAuth } from '@/core/infrastructure/auth/verifyAuth';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // 🔒 Only admins can create categories
  const admin = await verifyAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
      return NextResponse.json({ error: 'Nom de catégorie invalide' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name: name.trim() },
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
