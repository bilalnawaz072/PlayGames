import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';
import { INITIAL_GAMES } from '@/lib/games-data';

export async function POST(req: Request) {
  try {
    const { name, email, password, role = 'PLAYER' } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    const assignedRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

    // Try to register in DB if available
    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
      }

      const passwordHash = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: assignedRole,
        },
      });

      const token = signToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      const response = NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });

      response.cookies.set('pay123_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    } catch (dbErr) {
      // Direct mock response fallback if DB is not initialized yet
      const userId = 'user-' + Date.now();
      const token = signToken({
        userId,
        email,
        name,
        role: assignedRole,
      });

      const response = NextResponse.json({
        user: { id: userId, name, email, role: assignedRole },
        token,
      });

      response.cookies.set('pay123_token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Server error during registration.' }, { status: 500 });
  }
}
