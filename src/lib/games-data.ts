export interface GameItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  thumbnailUrl: string;
  embedUrl: string;
  gameType: 'THREEJS_3D' | 'IFRAME';
  threeEngineId?: 'WAVE_DASH' | 'CYBER_DRIFT' | 'CUBE_STACK' | 'TUNNEL_RUNNER';
  isFeatured: boolean;
  isApproved: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  playsCount: number;
  likesCount: number;
  dislikesCount: number;
  developerName?: string;
  createdAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  iconName: string;
}

export const INITIAL_CATEGORIES: CategoryItem[] = [
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

export const INITIAL_GAMES: GameItem[] = [
  {
    id: 'game-element-blocks',
    title: 'Element Blocks',
    slug: 'element-blocks',
    description: 'Drag and place wooden element blocks onto the grid. Fill horizontal or vertical lines to clear blocks and score massive combo points in this addictive puzzle game!',
    category: 'Puzzle',
    tags: ['puzzle', 'blocks', 'logic', 'famobi', 'brain'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    embedUrl: 'https://play.famobi.com/wrapper/element-blocks/A1000-10',
    gameType: 'IFRAME',
    isFeatured: true,
    isApproved: true,
    status: 'APPROVED',
    playsCount: 1420,
    likesCount: 280,
    dislikesCount: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'game-tower-crash-3d',
    title: 'Tower Crash 3D',
    slug: 'tower-crash-3d',
    description: 'Aim and shoot colored balls to match and destroy the 3D tower blocks before running out of shots! A thrilling 3D physics arcade challenge.',
    category: '3D Games',
    tags: ['3d', 'arcade', 'famobi', 'shooting', 'tower'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    embedUrl: 'https://play.famobi.com/wrapper/tower-crash-3d/A1000-10',
    gameType: 'IFRAME',
    isFeatured: true,
    isApproved: true,
    status: 'APPROVED',
    playsCount: 2150,
    likesCount: 450,
    dislikesCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'game-8-ball-billiards',
    title: '8 Ball Billiards Classic',
    slug: '8-ball-billiards-classic',
    description: 'Master the pool table in 8 Ball Billiards Classic! Adjust your cue angle, line up the power bar, and pocket all your solid or striped balls to win.',
    category: 'Sports',
    tags: ['sports', 'billiards', 'pool', '8ball', 'famobi', 'arcade'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    embedUrl: 'https://play.famobi.com/wrapper/8-ball-billiards-classic/A1000-10',
    gameType: 'IFRAME',
    isFeatured: true,
    isApproved: true,
    status: 'APPROVED',
    playsCount: 3890,
    likesCount: 820,
    dislikesCount: 18,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'game-basketball-superstars',
    title: 'Basketball Superstars',
    slug: 'basketball-superstars',
    description: 'Step up to the court in Basketball Superstars! Swipe to shoot perfect swishes, clear bonus targets, and unlock basketball cosmetics.',
    category: 'Sports',
    tags: ['sports', 'basketball', 'arcade', 'famobi', 'shooting'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80',
    embedUrl: 'https://play.famobi.com/wrapper/basketball-superstars/A1000-10',
    gameType: 'IFRAME',
    isFeatured: true,
    isApproved: true,
    status: 'APPROVED',
    playsCount: 1980,
    likesCount: 390,
    dislikesCount: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'game-wave-dash-3d',
    title: 'Wave Dash 3D',
    slug: 'wave-dash-3d',
    description: 'High-speed synthwave 3D runner. Dodge obstacles, collect neon energy spheres, and push your reaction speed to the limits!',
    category: '3D Games',
    tags: ['3d', 'runner', 'synthwave', 'action'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    embedUrl: '/#',
    gameType: 'THREEJS_3D',
    threeEngineId: 'WAVE_DASH',
    isFeatured: true,
    isApproved: true,
    status: 'APPROVED',
    playsCount: 4120,
    likesCount: 910,
    dislikesCount: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'game-cyber-drift-3d',
    title: 'Cyber Drift 3D',
    slug: 'cyber-drift-3d',
    description: 'Enter a futuristic cyberpunk tunnel circuit. Weave through laser gates and drift past glowing barriers.',
    category: 'Drift',
    tags: ['3d', 'drift', 'cyberpunk', 'car'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    embedUrl: '/#',
    gameType: 'THREEJS_3D',
    threeEngineId: 'CYBER_DRIFT',
    isFeatured: true,
    isApproved: true,
    status: 'APPROVED',
    playsCount: 3250,
    likesCount: 780,
    dislikesCount: 22,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'game-cube-stack-3d',
    title: 'Cube Stack 3D',
    slug: 'cube-stack-3d',
    description: 'Precision timing block stacker! Stack moving 3D cubes as high as possible without trimming off the edges.',
    category: 'Puzzle',
    tags: ['3d', 'puzzle', 'arcade', 'blocks'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    embedUrl: '/#',
    gameType: 'THREEJS_3D',
    threeEngineId: 'CUBE_STACK',
    isFeatured: false,
    isApproved: true,
    status: 'APPROVED',
    playsCount: 2840,
    likesCount: 620,
    dislikesCount: 10,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'game-tunnel-runner-3d',
    title: 'Tunnel Runner 3D',
    slug: 'tunnel-runner-3d',
    description: 'Sprint through a 360-degree cylindrical space tunnel. Rotate your path to avoid falling obstacles.',
    category: '3D Games',
    tags: ['3d', 'tunnel', 'arcade', 'speed'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    embedUrl: '/#',
    gameType: 'THREEJS_3D',
    threeEngineId: 'TUNNEL_RUNNER',
    isFeatured: false,
    isApproved: true,
    status: 'APPROVED',
    playsCount: 1980,
    likesCount: 430,
    dislikesCount: 8,
    createdAt: new Date().toISOString(),
  },
];
