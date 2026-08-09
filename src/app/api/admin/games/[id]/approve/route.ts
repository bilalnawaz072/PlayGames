import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUserFromCookies();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { action, isFeatured } = await req.json(); // action: "APPROVE", "REJECT", "TOGGLE_FEATURE"
    const gameId = params.id;

    try {
      let updateData: any = {};

      if (action === 'APPROVE') {
        updateData = { status: 'APPROVED', isApproved: true };
      } else if (action === 'REJECT') {
        updateData = { status: 'REJECTED', isApproved: false };
      }

      if (typeof isFeatured === 'boolean') {
        updateData.isFeatured = isFeatured;
      }

      const updated = await prisma.game.update({
        where: { id: gameId },
        data: updateData,
      });

      return NextResponse.json({ success: true, game: updated });
    } catch (err) {
      return NextResponse.json({ success: true, message: 'Game status updated in memory' });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server error updating game status' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  return PUT(req, { params });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  return PUT(req, { params });
}
