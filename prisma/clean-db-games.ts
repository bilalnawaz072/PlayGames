import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDbGames() {
  console.log('🧹 Deleting ALL games from database as requested...');
  try {
    await prisma.game.deleteMany({});
    const count = await prisma.game.count();
    console.log(`✅ All games deleted! Total games in database: ${count}`);
  } catch (err: any) {
    console.error('Clean DB error:', err?.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDbGames();
