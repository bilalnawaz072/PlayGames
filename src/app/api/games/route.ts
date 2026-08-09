import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'popular';

  try {
    let whereClause: any = {};

    if (q) {
      whereClause.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
        { tags: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (category && category.toLowerCase() !== 'all') {
      whereClause.category = { equals: category, mode: 'insensitive' };
    }

    let orderBy: any = { playsCount: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };
    if (sort === 'rating') orderBy = { likesCount: 'desc' };
    if (sort === 'title') orderBy = { title: 'asc' };

    const dbGames = await prisma.game.findMany({
      where: whereClause,
      orderBy,
    });

    const formatted = dbGames.map((g) => ({
      ...g,
      tags: typeof g.tags === 'string' ? g.tags.split(',') : g.tags,
    }));
    return NextResponse.json({ games: formatted });
  } catch (err) {
    console.error('PostgreSQL DB query error in /api/games:', err);
    return NextResponse.json({ games: [] });
  }
}

// POST: Add new game directly into PostgreSQL database
export async function POST(req: Request) {
  try {
    const { title, description, category, tags, thumbnailUrl, embedUrl, gameType = 'IFRAME', threeEngineId } = await req.json();

    if (!title || !description || !category || !thumbnailUrl || !embedUrl) {
      return NextResponse.json({ error: 'Title, description, category, thumbnail URL, and embed URL are required.' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const tagsString = Array.isArray(tags) ? tags.join(',') : tags || category;

    const newGame = await prisma.game.create({
      data: {
        title,
        slug,
        description,
        category,
        tags: tagsString,
        thumbnailUrl,
        embedUrl,
        gameType,
        threeEngineId: gameType === 'THREEJS_3D' ? (threeEngineId || 'WAVE_DASH') : null,
        isApproved: true,
        status: 'APPROVED',
        playsCount: 1,
      },
    });

    return NextResponse.json({ success: true, game: newGame });
  } catch (error: any) {
    console.error('Error creating game in database:', error);
    return NextResponse.json({ error: error?.message || 'Failed to save game to PostgreSQL database.' }, { status: 500 });
  }
}
