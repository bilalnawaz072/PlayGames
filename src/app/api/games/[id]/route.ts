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
    const { title, description, category, thumbnailUrl, embedUrl, gameType = 'IFRAME', tags } = await req.json();

    if (!title || !description || !category || !thumbnailUrl || !embedUrl) {
      return NextResponse.json({ error: 'Title, description, category, thumbnail URL, and embed URL are required.' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const tagsString = Array.isArray(tags) ? tags.join(',') : tags || category;

    const updated = await prisma.game.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        description,
        category,
        thumbnailUrl,
        embedUrl,
        gameType,
        tags: tagsString,
      },
    });

    return NextResponse.json({ success: true, game: updated });
  } catch (error) {
    console.error('Error updating game in database:', error);
    return NextResponse.json({ error: 'Failed to update game in database.' }, { status: 500 });
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
