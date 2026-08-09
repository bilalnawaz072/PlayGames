import { PrismaClient, UserRole, GameStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CATEGORIES = [
  { id: 'cat-demo', name: 'Demo Games', slug: 'demo-games', iconName: 'Sparkles' },
  { id: 'cat-3d', name: '3D Games', slug: '3d-games', iconName: 'Box' },
  { id: 'cat-action', name: 'Action', slug: 'action', iconName: 'Zap' },
  { id: 'cat-arcade', name: 'Arcade', slug: 'arcade', iconName: 'Gamepad2' },
  { id: 'cat-bike', name: 'Bike', slug: 'bike', iconName: 'Bike' },
  { id: 'cat-board', name: 'Board', slug: 'board', iconName: 'Grid' },
  { id: 'cat-bubble', name: 'Bubble', slug: 'bubble', iconName: 'Circle' },
  { id: 'cat-car', name: 'Car', slug: 'car', iconName: 'Car' },
  { id: 'cat-cards', name: 'Cards', slug: 'cards', iconName: 'Layers' },
  { id: 'cat-cooking', name: 'Cooking', slug: 'cooking', iconName: 'Utensils' },
  { id: 'cat-drift', name: 'Drift', slug: 'drift', iconName: 'Flame' },
  { id: 'cat-fun', name: 'Fun', slug: 'fun', iconName: 'Smile' },
  { id: 'cat-logic', name: 'Logic', slug: 'logic', iconName: 'Brain' },
  { id: 'cat-mahjong', name: 'Mahjong', slug: 'mahjong', iconName: 'SquareDot' },
  { id: 'cat-match3', name: 'Match 3', slug: 'match-3', iconName: 'Sparkles' },
  { id: 'cat-puzzle', name: 'Puzzle', slug: 'puzzle', iconName: 'Puzzle' },
  { id: 'cat-shooting', name: 'Shooting', slug: 'shooting', iconName: 'Crosshair' },
  { id: 'cat-solitaire', name: 'Solitaire', slug: 'solitaire', iconName: 'Crown' },
  { id: 'cat-sports', name: 'Sports', slug: 'sports', iconName: 'Trophy' },
  { id: 'cat-word', name: 'Word', slug: 'word', iconName: 'Type' },
  { id: 'cat-10x10', name: '10x10', slug: '10x10', iconName: 'LayoutGrid' },
];

const GAMES: any[] = [];

async function main() {
  console.log('🌱 Seeding PostgreSQL Database with default games...');

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@playgames.com' },
    update: { role: UserRole.ADMIN },
    create: {
      name: 'Admin',
      email: 'admin@playgames.com',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const normalUser = await prisma.user.upsert({
    where: { email: 'user@playgames.com' },
    update: { role: UserRole.USER },
    create: {
      name: 'Player One',
      email: 'user@playgames.com',
      passwordHash: userPasswordHash,
      role: UserRole.USER,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  let orderIndex = 0;
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, iconName: cat.iconName, order: orderIndex },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        iconName: cat.iconName,
        order: orderIndex,
      },
    });
    orderIndex++;
  }

  for (const g of GAMES) {
    await prisma.game.upsert({
      where: { slug: g.slug },
      update: {
        title: g.title,
        description: g.description,
        category: g.category,
        tags: g.tags,
        thumbnailUrl: g.thumbnailUrl,
        embedUrl: g.embedUrl,
        gameType: g.gameType,
        threeEngineId: g.threeEngineId || null,
        isFeatured: g.isFeatured,
        isApproved: true,
        status: GameStatus.APPROVED,
      },
      create: {
        id: g.id,
        title: g.title,
        slug: g.slug,
        description: g.description,
        category: g.category,
        tags: g.tags,
        thumbnailUrl: g.thumbnailUrl,
        embedUrl: g.embedUrl,
        gameType: g.gameType,
        threeEngineId: g.threeEngineId || null,
        isFeatured: g.isFeatured,
        isApproved: true,
        status: GameStatus.APPROVED,
        playsCount: g.playsCount,
        likesCount: g.likesCount,
        dislikesCount: g.dislikesCount,
        developerId: adminUser.id,
      },
    });
  }

  console.log('✅ PostgreSQL database seeded successfully with default Famobi & 3D games!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
