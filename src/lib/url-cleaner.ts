// Helper utility to convert ad-wrapped game URLs to direct 100% gap-free game URLs

export function cleanEmbedUrl(rawUrl: string): string {
  if (!rawUrl) return '';

  let cleaned = rawUrl.trim();

  // Fix Famobi wrapper URLs: https://play.famobi.com/wrapper/om-nom-run/A1000-10 -> https://play.famobi.com/om-nom-run/A1000-10
  if (cleaned.includes('play.famobi.com/wrapper/')) {
    cleaned = cleaned.replace('play.famobi.com/wrapper/', 'play.famobi.com/');
  }

  return cleaned;
}
