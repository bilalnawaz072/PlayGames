import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDbGames() {
  console.log('🧹 Cleaning database extra games...');
  try {
    // Delete old default seed games except 1 initial game
    const defaultIdsToDelete = [
      'game-tower-crash-3d',
      'game-8-ball-billiards',
      'game-basketball-superstars',
      'game-wave-dash-3d',
      'game-cyber-drift-3d',
      'game-cube-stack-3d',
      'game-tunnel-runner-3d',
      'tower-crash-3d',
      '8-ball-billiards-classic',
      'basketball-superstars',
      'wave-dash-3d',
      'cyber-drift-3d',
      'cube-stack-3d',
      'tunnel-runner-3d',
    ];

    await prisma.game.deleteMany({
      where: {
        OR: [
          { id: { in: defaultIdsToDelete } },
          { slug: { in: defaultIdsToDelete } },
        ],
      },
    });

    const count = await prisma.game.count();
    console.log(`✅ Cleaned up! Remaining games count in DB: ${count}`);
  } catch (err: any) {
    console.error('Clean DB error:', err?.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDbGames();
