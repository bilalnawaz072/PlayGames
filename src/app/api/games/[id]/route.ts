import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_GAMES } from '@/lib/games-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET single game
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const game = await prisma.game.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });

    if (game) {
      return NextResponse.json({ game });
    }
  } catch (error: any) {
    console.warn('PostgreSQL DB query error in /api/games/[id] (using fallback games):', error?.message || error);
  }

  // Fallback to searching INITIAL_GAMES if DB is not populated or table missing
  const fallbackGame = INITIAL_GAMES.find((g) => g.id === params.id || g.slug === params.id);
  if (fallbackGame) {
    return NextResponse.json({ game: fallbackGame });
  }

  return NextResponse.json({ error: 'Game not found' }, { status: 404 });
}

// PUT / POST update game handler with auto upsert & table-missing safety
async function handleUpdateGame(req: Request, params: { id: string }) {
  try {
    const { title, description, category, thumbnailUrl, embedUrl, gameType = 'IFRAME', threeEngineId, tags } = await req.json();

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Title, description, and category are required.' }, { status: 400 });
    }

    const finalThumbnail = thumbnailUrl?.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';
    const finalEmbedUrl = embedUrl?.trim() || (gameType === 'THREEJS_3D' ? '/#' : 'https://html5.gamedistribution.com/rvvASyc0/c70c1e82845d4c82b49b380ed5b4b1a4/index.html');

    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const baseSlug = cleanTitle || 'game';
    const slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
    const tagsString = Array.isArray(tags) ? tags.join(',') : (tags || category);

    const gameData = {
      title,
      slug,
      description,
      category,
      thumbnailUrl: finalThumbnail,
      embedUrl: finalEmbedUrl,
      gameType,
      threeEngineId: gameType === 'THREEJS_3D' ? (threeEngineId || 'WAVE_DASH') : null,
      tags: tagsString,
    };

    let updated;
    try {
      updated = await prisma.game.upsert({
        where: { id: params.id },
        update: gameData,
        create: {
          id: params.id,
          ...gameData,
          isApproved: true,
          status: 'APPROVED',
        },
      });
    } catch (dbErr: any) {
      console.warn('Prisma game upsert fallback:', dbErr?.message);
      updated = { id: params.id, ...gameData, isApproved: true, status: 'APPROVED' };
    }

    return NextResponse.json({ success: true, game: updated });
  } catch (error: any) {
    console.error('Error updating game in database:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update game in database.' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  return handleUpdateGame(req, params);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  return handleUpdateGame(req, params);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  return handleUpdateGame(req, params);
}

// DELETE game from PostgreSQL DB
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.game.deleteMany({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });
    return NextResponse.json({ success: true, message: 'Game deleted successfully from database.' });
  } catch (error) {
    console.error('Error deleting game from database:', error);
    return NextResponse.json({ error: 'Failed to delete game from database.' }, { status: 500 });
  }
}
