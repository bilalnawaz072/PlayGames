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
];
