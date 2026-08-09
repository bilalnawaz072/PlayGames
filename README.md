# 🎮 Pay123 / GameVault 3D — Next-Gen Web & 3D Gaming Platform

![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.18-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)

**Pay123 (GameVault 3D)** is a state-of-the-art web-based gaming platform engineered with **Next.js 14 App Router**, **Three.js WebGL Engines**, **Prisma ORM**, and **Tailwind CSS**. It offers instant browser gaming without paywalls or annoying popups, packed with native 3D games, multi-screen play mode, an embedded AI Gaming Buddy, theme switching, developer submission portal, and a full-fledged Super Admin dashboard.

---

## 🌟 Key Features

### 🎮 Custom 3D WebGL Mini-Games (Three.js Engine)
Built directly into the platform without external embeds:
* 🏎️ **Wave Dash**: High-speed Synthwave 3D runner with dynamic light trails and neon obstacle dodging.
* 🌌 **Cyber Drift**: Cyberpunk 3D tunnel drift game with smooth camera controls and obstacle evasion.
* 🧊 **Cube Stack**: 3D block stacking physics and precision timing puzzle.
* 🌀 **Tunnel Runner**: 360-degree speed tunnel runner featuring dynamic lighting and particle systems.

### 📺 Multi-Screen Gaming Hub (`/multiscreen`)
* Play **up to 4 games concurrently** on a single screen with custom grid layouts (2x1, 2x2, focus mode).
* Independent audio toggles, game swapping, and full control mapping for ultimate multi-task gaming.

### 🤖 Play AI Buddy
* Built-in interactive AI Gaming Assistant modal accessible on any page.
* Provides instant game recommendations, gameplay strategies, high-score tips, and interactive player assistance.

### 🎨 Dynamic Theme Engine (6 Theme Presets)
Change theme styles in real time across the entire portal:
* **Dark** (Sleek Onyx & Electric Neon)
* **Light** (Clean High-Contrast Glassmorphism)
* **Cyberpunk** (Neon Yellow & Magenta Vibrant)
* **Hacker** (Matrix Green & Terminal Dark)
* **Soft** (Pastel Purple & Soft Slate)
* **Arena** (Competitive Crimson & Gold)

### 🛠️ Developer Submission Portal (`/developer`)
* Developers can submit custom **HTML5 / IFrame** games or register **Three.js 3D** engines.
* Real-time metrics dashboard tracking game play counts, likes, dislikes, and moderation status (`PENDING`, `APPROVED`, `REJECTED`).
* Edit or update game details and thumbnails seamlessly.

### 🛡️ Super Admin Control Room (`/admin`)
* **Live Site Configuration**: Customize Site Name, Tagline, Hero Title, Subtitle, Announcement Banners, Accent Colors, and Feature Flags (`showAiBuddy`, `showMultiScreen`, `showFeatured3D`).
* **Game Moderation**: Approve, reject, feature/unfeature, edit, or delete submitted games.
* **Category Manager**: Create, reorder, and update game categories with dynamic Lucide React icons.
* **User Management**: Change user roles between `PLAYER`, `DEVELOPER`, and `SUPER_ADMIN`.
* **Platform Analytics**: Global counters for games, total plays, total users, and engagement stats.

### 🔐 Authentication & Security
* Role-Based Access Control (RBAC) with JWT session cookies (`jsonwebtoken`) and `bcryptjs` password hashing.

---

## 🏗️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | [Next.js 14 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **3D Engine** | [Three.js](https://threejs.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & Lucide React Icons |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma v5](https://www.prisma.io/) |
| **Authentication** | Custom JWT (`jsonwebtoken`) + `bcryptjs` |
| **Deployment** | Docker (Alpine Multi-stage), Railway (`railway.json`), Nixpacks |

---

## 📁 Project Structure

```
Pay123/
├── .env.example              # Environment variables template
├── Dockerfile                # Multi-stage production Docker image build
├── railway.json              # Railway deployment config
├── nixpacks.toml             # Nixpacks builder config
├── package.json              # Dependencies and scripts
├── prisma/
│   ├── schema.prisma         # Prisma Database Schema (User, Game, Category, SiteConfig, etc.)
│   └── seed.ts               # Database Seeder (Admin user, Developer user, Default Categories & Games)
├── public/                   # Static assets & game thumbnails
└── src/
    ├── app/
    │   ├── admin/            # Super Admin Dashboard (/admin)
    │   ├── developer/        # Developer Portal (/developer)
    │   ├── multiscreen/      # Multi-Screen Gaming Hub (/multiscreen)
    │   ├── play/[slug]/      # Game Player Page & Engine View (/play/:slug)
    │   ├── api/              # RESTful API Endpoints (auth, games, admin, site-config, categories)
    │   ├── globals.css       # Custom Theme Variables & Styles
    │   ├── layout.tsx        # Global Layout with Providers & Navbar
    │   └── page.tsx          # Homepage with Hero, Featured 3D, Filters, Grid
    ├── components/
    │   ├── AuthModal.tsx          # Login & Signup Modal
    │   ├── GameCard.tsx           # Game Card Component with Like/Play counters
    │   ├── GamePlayer.tsx         # Fullscreen / Theater Mode Game Frame
    │   ├── MultiScreenPlayer.tsx  # Multi-Screen Grid Engine
    │   ├── Navbar.tsx             # Main Navigation Bar
    │   ├── PlayBuddyModal.tsx     # AI Assistant Chat Modal
    │   ├── Sidebar.tsx            # Category Navigation Drawer
    │   ├── SiteConfigProvider.tsx # Dynamic Site Config State Manager
    │   ├── ThemeProvider.tsx      # Dynamic Theme Engine State Manager
    │   └── Three3DGames.tsx       # Built-in Three.js 3D WebGL Engines
    └── lib/
        ├── auth.ts           # JWT Auth Verification Utilities
        └── prisma.ts         # Prisma Client Instance
```

---

## 🚀 Getting Started

Follow these steps to set up and run **Pay123 / GameVault 3D** locally.

### 1️⃣ Prerequisites
Make sure you have installed:
* **Node.js** (v18.x or v20.x or higher)
* **PNPM** (`npm i -g pnpm`) or **NPM**
* **PostgreSQL** instance (local, Docker, or hosted like Supabase / Railway / Neon)

---

### 2️⃣ Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/your-username/pay123.git
cd pay123

# Install dependencies using pnpm
pnpm install

# OR using npm
npm install
```

---

### 3️⃣ Configure Environment Variables

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Update the `.env` parameters:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gamevault?schema=public"
JWT_SECRET="super-secret-gamevault-jwt-token-key-2026-secure"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Customizable Admin Credentials
ADMIN_EMAIL="admin@play123.com"
ADMIN_PASSWORD="admin123"
ADMIN_NAME="Super Admin"
```

---

### 4️⃣ Database Setup & Seeding

Sync your database schema with Prisma and seed default categories, games, admin, and developer accounts:

```bash
# Push database schema to PostgreSQL
pnpm db:push
# or: npx prisma db push

# Seed initial admin, developer, categories & demo games
pnpm db:seed
# or: npm run db:seed
```

---

### 5️⃣ Run Development Server

```bash
pnpm dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Demo Accounts

After running `pnpm db:seed`, you can log in with the following seeded credentials:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@play123.com` | `admin123` | Full access (`/admin`, Site Config, Game Moderation, User Roles) |
| **Developer** | `developer@play123.com` | `dev123` | Developer access (`/developer`, Submit & Manage Games) |
| **Player** | Create via Signup modal | *Your choice* | Save Favorites, Rate Games, Multi-Screen Mode |

---

## 📜 NPM / PNPM Scripts Reference

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the Next.js development server on port 3000 |
| `pnpm build` | Generates Prisma client and builds production Next.js app |
| `pnpm start` | Runs the compiled production Next.js server |
| `pnpm lint` | Runs Next.js ESLint checker |
| `pnpm db:push` | Pushes Prisma schema updates directly to the database |
| `pnpm db:seed` | Runs seed script to populate default data & admin user |
| `pnpm postinstall` | Automatically runs `prisma generate` after package install |

---

## 🐳 Docker Deployment

A multi-stage production `Dockerfile` is included in the root directory.

### Build & Run Container

```bash
# Build the production Docker image
docker build -t pay123-game-platform .

# Run container on port 3000
docker run -d \
  --name pay123_app \
  -p 3000:3000 \
  --env-file .env \
  pay123-game-platform
```

Access the app at `http://localhost:3000`.

---

## ☁️ Deployment Guides

### Railway Deployment
1. Connect your GitHub repository to [Railway](https://railway.app/).
2. Provision a **PostgreSQL** database plugin in Railway.
3. Add Environment Variables (`DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
4. Railway will automatically detect `railway.json` and `Dockerfile` or `nixpacks.toml` to build and deploy.

### Vercel / Render Deployment
* For Vercel or Render, set the build command to `pnpm build` and start command to `pnpm start`.
* Set environment variable `DATABASE_URL` pointing to your hosted PostgreSQL database (e.g. Supabase, Neon, Railway).

---

## 🌐 API Route Summary

* `POST /api/auth/register` — User registration
* `POST /api/auth/login` — User login & JWT cookie issue
* `POST /api/auth/logout` — Logout user session
* `GET /api/auth/me` — Fetch authenticated user profile
* `GET /api/games` — Fetch filtered list of games (category, search, limit)
* `POST /api/games` — Developer game submission
* `GET /api/games/[slug]` — Fetch specific game details
* `POST /api/games/[slug]/rate` — Like / Dislike game rating
* `POST /api/games/[slug]/favorite` — Toggle user favorite game
* `GET /api/categories` — Get active categories
* `GET /api/site-config` — Get active site configuration
* `PUT /api/site-config` — Update site config (Admin only)
* `GET /api/admin/games` — Get all games (including pending/rejected) for admin moderation
* `PATCH /api/admin/games/[id]` — Moderation actions (approve, reject, feature)

---

## 📄 License

This project is open-source and available under the **MIT License**.

---

<p align="center">
  Crafted with ❤️ for web gaming enthusiasts & 3D WebGL developers.
</p>
