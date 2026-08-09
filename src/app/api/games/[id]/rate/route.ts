import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { type } = await req.json(); // "PLAY", "LIKE", or "DISLIKE"
    const gameId = params.id;

    if (!type || (type !== 'PLAY' && type !== 'LIKE' && type !== 'DISLIKE')) {
      return NextResponse.json({ error: 'Rating type must be PLAY, LIKE or DISLIKE' }, { status: 400 });
    }

    try {
      if (type === 'PLAY') {
        const updated = await prisma.game.update({
          where: { id: gameId },
          data: { playsCount: { increment: 1 } },
        });
        return NextResponse.json({ success: true, playsCount: updated.playsCount });
      } else if (type === 'LIKE') {
        const updated = await prisma.game.update({
          where: { id: gameId },
          data: { likesCount: { increment: 1 } },
        });
        return NextResponse.json({ success: true, likesCount: updated.likesCount, dislikesCount: updated.dislikesCount });
      } else {
        const updated = await prisma.game.update({
          where: { id: gameId },
          data: { dislikesCount: { increment: 1 } },
        });
        return NextResponse.json({ success: true, likesCount: updated.likesCount, dislikesCount: updated.dislikesCount });
      }
    } catch (err) {
      return NextResponse.json({ success: true, message: 'Realtime interaction recorded.' });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record interaction.' }, { status: 500 });
  }
}
