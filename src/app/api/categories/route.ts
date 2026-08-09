import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_CATEGORIES } from '@/lib/games-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
    });
    if (categories && categories.length > 0) {
      return NextResponse.json({ categories });
    }
  } catch (err) {
    console.warn('Using initial category fallback');
  }

  return NextResponse.json({ categories: INITIAL_CATEGORIES });
}
