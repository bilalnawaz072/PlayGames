import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET single game
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const game = await prisma.game.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json({ game });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}

// PUT / UPDATE game in PostgreSQL DB
export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

    const updated = await prisma.game.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        description,
        category,
        thumbnailUrl: finalThumbnail,
        embedUrl: finalEmbedUrl,
        gameType,
        threeEngineId: gameType === 'THREEJS_3D' ? (threeEngineId || 'WAVE_DASH') : null,
        tags: tagsString,
      },
    });

    return NextResponse.json({ success: true, game: updated });
  } catch (error: any) {
    console.error('Error updating game in database:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update game in database.' }, { status: 500 });
  }
}

// DELETE game from PostgreSQL DB
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.game.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Game deleted successfully from database.' });
  } catch (error) {
    console.error('Error deleting game from database:', error);
    return NextResponse.json({ error: 'Failed to delete game from database.' }, { status: 500 });
  }
}
