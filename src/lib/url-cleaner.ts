// Helper utility to convert ad-wrapped game URLs to 100% full-screen gap-free game URLs
export function cleanEmbedUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let cleaned = rawUrl.trim();

  // Fix Famobi standard URLs by converting to Famobi wrapper URLs:
  // e.g. https://play.famobi.com/garden-bloom/A1000-10B -> https://play.famobi.com/wrapper/garden-bloom/A1000-10B
  // Famobi's /wrapper/ path strips div-gpt-ad-banner-right and div-gpt-ad-banner-left sidebars completely!
  if (cleaned.includes('play.famobi.com/') && !cleaned.includes('play.famobi.com/wrapper/')) {
    cleaned = cleaned.replace('play.famobi.com/', 'play.famobi.com/wrapper/');
  }

  return cleaned;
}
