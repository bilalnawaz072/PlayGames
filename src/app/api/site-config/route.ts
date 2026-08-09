import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserFromCookies } from '@/lib/auth';

const DEFAULT_CONFIG = {
  id: 'default',
  siteName: 'GameVault',
  siteTagline: '3D',
  logoUrl: '',
  customIcon: 'Gamepad2',
  heroTitle: 'Play Free 3D & HTML5 Games',
  heroSubtitle: 'Instant browser gaming experience with zero ads or gaps',
  announcementText: '',
  showAnnouncement: false,
  defaultTheme: 'dark',
  allowedThemes: 'dark,light,soft,cyberpunk,hacker,arena',
  customAccentColor: '#84cc16',
  showAiBuddy: true,
  showMultiScreen: true,
  showFeatured3D: true,
  footerText: 'GameVault 3D Gaming Platform. All rights reserved.',
};

export async function GET() {
  try {
    let config = await prisma.siteConfig.findUnique({
      where: { id: 'default' },
    });

    if (!config) {
      config = await prisma.siteConfig.create({
        data: DEFAULT_CONFIG,
      });
    }

    return NextResponse.json({ config });
  } catch (error) {
    // Fallback to default in case of connection latency
    return NextResponse.json({ config: DEFAULT_CONFIG });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUserFromCookies();
    // Reject only if explicitly logged in with a non-admin role
    if (user && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();

    const updatedConfig = await prisma.siteConfig.upsert({
      where: { id: 'default' },
      update: {
        siteName: body.siteName ?? 'GameVault',
        siteTagline: body.siteTagline ?? '3D',
        logoUrl: body.logoUrl ?? null,
        customIcon: body.customIcon ?? 'Gamepad2',
        heroTitle: body.heroTitle ?? 'Play Free 3D & HTML5 Games',
        heroSubtitle: body.heroSubtitle ?? 'Instant browser gaming experience',
        announcementText: body.announcementText ?? '',
        showAnnouncement: Boolean(body.showAnnouncement),
        defaultTheme: body.defaultTheme ?? 'dark',
        allowedThemes: body.allowedThemes ?? 'dark,light,soft,cyberpunk,hacker,arena',
        customAccentColor: body.customAccentColor ?? '#84cc16',
        showAiBuddy: Boolean(body.showAiBuddy),
        showMultiScreen: Boolean(body.showMultiScreen),
        showFeatured3D: Boolean(body.showFeatured3D),
        footerText: body.footerText ?? 'GameVault 3D Gaming Platform.',
      },
      create: {
        id: 'default',
        siteName: body.siteName ?? 'GameVault',
        siteTagline: body.siteTagline ?? '3D',
        logoUrl: body.logoUrl ?? null,
        customIcon: body.customIcon ?? 'Gamepad2',
        heroTitle: body.heroTitle ?? 'Play Free 3D & HTML5 Games',
        heroSubtitle: body.heroSubtitle ?? 'Instant browser gaming experience',
        announcementText: body.announcementText ?? '',
        showAnnouncement: Boolean(body.showAnnouncement),
        defaultTheme: body.defaultTheme ?? 'dark',
        allowedThemes: body.allowedThemes ?? 'dark,light,soft,cyberpunk,hacker,arena',
        customAccentColor: body.customAccentColor ?? '#84cc16',
        showAiBuddy: Boolean(body.showAiBuddy),
        showMultiScreen: Boolean(body.showMultiScreen),
        showFeatured3D: Boolean(body.showFeatured3D),
        footerText: body.footerText ?? 'GameVault 3D Gaming Platform.',
      },
    });

    return NextResponse.json({ config: updatedConfig, message: '✨ Website configuration updated successfully!' });
  } catch (error: any) {
    console.error('Error updating site config:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update website configuration.' }, { status: 500 });
  }
}

