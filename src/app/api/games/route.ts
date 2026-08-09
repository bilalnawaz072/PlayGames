import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_GAMES } from '@/lib/games-data';

export const dynamic = 'force-dynamic';

function filterFallbackGames(q: string, category: string, sort: string) {
  let list = [...INITIAL_GAMES];
  if (q) {
    list = list.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (category && category.toLowerCase() !== 'all') {
    list = list.filter((g) => g.category.toLowerCase() === category.toLowerCase());
  }
  if (sort === 'newest') list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (sort === 'rating') list.sort((a, b) => b.likesCount - a.likesCount);
  if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === 'popular') list.sort((a, b) => b.playsCount - a.playsCount);
  return list;
}

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

    if (dbGames && dbGames.length > 0) {
      const formatted = dbGames.map((g) => ({
        ...g,
        tags: typeof g.tags === 'string' ? g.tags.split(',') : g.tags,
      }));
      return NextResponse.json({ games: formatted });
    }

    // If database returned 0 games, return fallback games
    const fallbackList = filterFallbackGames(q, category, sort);
    return NextResponse.json({ games: fallbackList });
  } catch (err: any) {
    console.warn('PostgreSQL DB query error in /api/games (using default fallback games):', err?.message || err);
    // If DB error (e.g. P2021 table missing), return fallback games so app never crashes
    const fallbackList = filterFallbackGames(q, category, sort);
    return NextResponse.json({ games: fallbackList });
  }
}

// POST: Add new game directly into PostgreSQL database
export async function POST(req: Request) {
  try {
    const { title, description, category, tags, thumbnailUrl, embedUrl, gameType = 'IFRAME', threeEngineId } = await req.json();

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Title, description, and category are required.' }, { status: 400 });
    }

    const finalThumbnail = thumbnailUrl?.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';
    const finalEmbedUrl = embedUrl?.trim() || (gameType === 'THREEJS_3D' ? '/#' : 'https://html5.gamedistribution.com/rvvASyc0/c70c1e82845d4c82b49b380ed5b4b1a4/index.html');

    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const baseSlug = cleanTitle || 'game';
    const slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const tagsString = Array.isArray(tags) ? tags.join(',') : (tags || category);

    const newGame = await prisma.game.create({
      data: {
        title,
        slug,
        description,
        category,
        tags: tagsString,
        thumbnailUrl: finalThumbnail,
        embedUrl: finalEmbedUrl,
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
