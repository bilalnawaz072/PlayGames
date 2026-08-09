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

const GAMES: any[] = [
  {
    id: 'game-element-blocks',
    title: 'Element Blocks',
    slug: 'element-blocks',
    description: 'Drag and place wooden element blocks onto the grid. Fill horizontal or vertical lines to clear blocks and score massive combo points in this addictive puzzle game!',
    category: 'Puzzle',
    tags: 'puzzle,blocks,logic,famobi,brain',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    embedUrl: 'https://play.famobi.com/wrapper/element-blocks/A1000-10',
    gameType: 'IFRAME',
    isFeatured: true,
    playsCount: 1420,
    likesCount: 280,
    dislikesCount: 5,
  },
  {
    id: 'game-tower-crash-3d',
    title: 'Tower Crash 3D',
    slug: 'tower-crash-3d',
    description: 'Aim and shoot colored balls to match and destroy the 3D tower blocks before running out of shots! A thrilling 3D physics arcade challenge.',
    category: '3D Games',
    tags: '3d,arcade,famobi,shooting,tower',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    embedUrl: 'https://play.famobi.com/wrapper/tower-crash-3d/A1000-10',
    gameType: 'IFRAME',
    isFeatured: true,
    playsCount: 2150,
    likesCount: 450,
    dislikesCount: 12,
  },
  {
    id: 'game-8-ball-billiards',
    title: '8 Ball Billiards Classic',
    slug: '8-ball-billiards-classic',
    description: 'Master the pool table in 8 Ball Billiards Classic! Adjust your cue angle, line up the power bar, and pocket all your solid or striped balls to win.',
    category: 'Sports',
    tags: 'sports,billiards,pool,8ball,famobi,arcade',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    embedUrl: 'https://play.famobi.com/wrapper/8-ball-billiards-classic/A1000-10',
    gameType: 'IFRAME',
    isFeatured: true,
    playsCount: 3890,
    likesCount: 820,
    dislikesCount: 18,
  },
  {
    id: 'game-basketball-superstars',
    title: 'Basketball Superstars',
    slug: 'basketball-superstars',
    description: 'Step up to the court in Basketball Superstars! Swipe to shoot perfect swishes, clear bonus targets, and unlock basketball cosmetics.',
    category: 'Sports',
    tags: 'sports,basketball,arcade,famobi,shooting',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80',
    embedUrl: 'https://play.famobi.com/wrapper/basketball-superstars/A1000-10',
    gameType: 'IFRAME',
    isFeatured: true,
    playsCount: 1980,
    likesCount: 390,
    dislikesCount: 8,
  },
  {
    id: 'game-wave-dash-3d',
    title: 'Wave Dash 3D',
    slug: 'wave-dash-3d',
    description: 'High-speed synthwave 3D runner. Dodge obstacles, collect neon energy spheres, and push your reaction speed to the limits!',
    category: '3D Games',
    tags: '3d,runner,synthwave,action',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    embedUrl: '/#',
    gameType: 'THREEJS_3D',
    threeEngineId: 'WAVE_DASH',
    isFeatured: true,
    playsCount: 4120,
    likesCount: 910,
    dislikesCount: 15,
  },
  {
    id: 'game-cyber-drift-3d',
    title: 'Cyber Drift 3D',
    slug: 'cyber-drift-3d',
    description: 'Enter a futuristic cyberpunk tunnel circuit. Weave through laser gates and drift past glowing barriers.',
    category: 'Drift',
    tags: '3d,drift,cyberpunk,car',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    embedUrl: '/#',
    gameType: 'THREEJS_3D',
    threeEngineId: 'CYBER_DRIFT',
    isFeatured: true,
    playsCount: 3250,
    likesCount: 780,
    dislikesCount: 22,
  },
  {
    id: 'game-cube-stack-3d',
    title: 'Cube Stack 3D',
    slug: 'cube-stack-3d',
    description: 'Precision timing block stacker! Stack moving 3D cubes as high as possible without trimming off the edges.',
    category: 'Puzzle',
    tags: '3d,puzzle,arcade,blocks',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    embedUrl: '/#',
    gameType: 'THREEJS_3D',
    threeEngineId: 'CUBE_STACK',
    isFeatured: false,
    playsCount: 2840,
    likesCount: 620,
    dislikesCount: 10,
  },
  {
    id: 'game-tunnel-runner-3d',
    title: 'Tunnel Runner 3D',
    slug: 'tunnel-runner-3d',
    description: 'Sprint through a 360-degree cylindrical space tunnel. Rotate your path to avoid falling obstacles.',
    category: '3D Games',
    tags: '3d,tunnel,arcade,speed',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    embedUrl: '/#',
    gameType: 'THREEJS_3D',
    threeEngineId: 'TUNNEL_RUNNER',
    isFeatured: false,
    playsCount: 1980,
    likesCount: 430,
    dislikesCount: 8,
  },
];

async function main() {
  console.log('🌱 Seeding PostgreSQL Database with default games...');

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const developerPasswordHash = await bcrypt.hash('dev123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@playgames.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@playgames.com',
      passwordHash: adminPasswordHash,
      role: UserRole.SUPER_ADMIN,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const developerUser = await prisma.user.upsert({
    where: { email: 'developer@playgames.com' },
    update: {},
    create: {
      name: 'Apex Game Developer',
      email: 'developer@playgames.com',
      passwordHash: developerPasswordHash,
      role: UserRole.DEVELOPER,
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
        developerId: developerUser.id,
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
