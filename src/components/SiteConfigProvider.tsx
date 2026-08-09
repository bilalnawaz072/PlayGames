'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDataUpdate } from './DataUpdateContext';

export interface SiteConfig {
  siteName: string;
  siteTagline: string;
  logoUrl: string | null;
  customIcon: string;
  heroTitle: string;
  heroSubtitle: string;
  announcementText: string;
  showAnnouncement: boolean;
  defaultTheme: string;
  allowedThemes: string;
  customAccentColor: string;
  showAiBuddy: boolean;
  showMultiScreen: boolean;
  showFeatured3D: boolean;
  footerText: string;
}

const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: 'GameVault',
  siteTagline: '3D',
  logoUrl: null,
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

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => Promise<boolean>;
  refreshConfig: () => Promise<void>;
  loading: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  config: DEFAULT_SITE_CONFIG,
  updateConfig: async () => false,
  refreshConfig: async () => {},
  loading: false,
});

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [loading, setLoading] = useState(true);
  const { startUpdating, finishUpdating, failUpdating } = useDataUpdate();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      // Try local storage cache for instant rendering
      const cached = localStorage.getItem('gamevault_site_config');
      if (cached) {
        setConfig(JSON.parse(cached));
      }

      const res = await fetch('/api/site-config');
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
          localStorage.setItem('gamevault_site_config', JSON.stringify(data.config));
        }
      }
    } catch (e) {
      console.error('Failed to fetch site config:', e);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (newConfigPartial: Partial<SiteConfig>): Promise<boolean> => {
    const merged = { ...config, ...newConfigPartial };
    setConfig(merged);
    localStorage.setItem('gamevault_site_config', JSON.stringify(merged));

    startUpdating('Updating website configuration & theme settings...');

    const startTime = Date.now();
    try {
      const res = await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      });

      const data = await res.json().catch(() => ({}));

      // Ensure progress bar stays visible for smooth visual feedback (~1.2s)
      const elapsed = Date.now() - startTime;
      if (elapsed < 1200) {
        await new Promise((r) => setTimeout(r, 1200 - elapsed));
      }

      if (res.ok) {
        if (data.config) {
          setConfig(data.config);
          localStorage.setItem('gamevault_site_config', JSON.stringify(data.config));
        }
        finishUpdating('🎉 Website branding & settings updated!');
        return true;
      }
      console.error('Error saving site config:', data.error || 'Server error');
      failUpdating(data.error || 'Failed to update site configuration.');
      return false;
    } catch (e) {
      console.error('Error saving site config:', e);
      failUpdating('Network error updating site configuration.');
      return false;
    }
  };

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig, refreshConfig: fetchConfig, loading }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export const useSiteConfig = () => useContext(SiteConfigContext);
