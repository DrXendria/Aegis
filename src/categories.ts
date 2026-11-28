import { 
  Share2, Film, GraduationCap, Briefcase, 
  ShoppingCart, Gamepad2, Folder, Tag
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CustomCategory {
  id: string;
  name: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  isCustom?: boolean;
}

export interface PresetCategoryConfig {
  id: string;
  nameKey: string;
  defaultName: string;
  icon: LucideIcon;
  color: string;
}

export const PRESET_CATEGORIES: PresetCategoryConfig[] = [
  { id: 'social', nameKey: 'category_social', defaultName: 'Sosyal Medya', icon: Share2, color: '#3b82f6' },
  { id: 'entertainment', nameKey: 'category_entertainment', defaultName: 'Eğlence', icon: Film, color: '#ec4899' },
  { id: 'education', nameKey: 'category_education', defaultName: 'Eğitim', icon: GraduationCap, color: '#10b981' },
  { id: 'work', nameKey: 'category_work', defaultName: 'İş & Finans', icon: Briefcase, color: '#f59e0b' },
  { id: 'shopping', nameKey: 'category_shopping', defaultName: 'Alışveriş', icon: ShoppingCart, color: '#a855f7' },
  { id: 'gaming', nameKey: 'category_gaming', defaultName: 'Oyun', icon: Gamepad2, color: '#06b6d4' },
  { id: 'other', nameKey: 'category_other', defaultName: 'Diğer', icon: Folder, color: '#64748b' },
];

export const getCategoryDetails = (
  categoryId: string | undefined, 
  customCategories: CustomCategory[] = [], 
  t: (key: any) => any
): CategoryItem => {
  if (!categoryId || categoryId === 'other') {
    return {
      id: 'other',
      name: t('category_other') || 'Diğer',
      icon: Folder,
      color: '#64748b',
    };
  }

  // Check preset categories
  const preset = PRESET_CATEGORIES.find(c => c.id === categoryId);
  if (preset) {
    return {
      id: preset.id,
      name: t(preset.nameKey) || preset.defaultName,
      icon: preset.icon,
      color: preset.color,
    };
  }

  // Check custom categories
  const custom = customCategories.find(c => c.id === categoryId);
  if (custom) {
    return {
      id: custom.id,
      name: custom.name,
      icon: Tag,
      color: '#38bdf8',
      isCustom: true,
    };
  }

  // Fallback to custom/other
  return {
    id: categoryId,
    name: categoryId,
    icon: Tag,
    color: '#64748b',
  };
};

export const getAllCategories = (
  customCategories: CustomCategory[] = [],
  t: (key: any) => any
): CategoryItem[] => {
  const presets: CategoryItem[] = PRESET_CATEGORIES.map(p => ({
    id: p.id,
    name: t(p.nameKey) || p.defaultName,
    icon: p.icon,
    color: p.color,
  }));

  const customs: CategoryItem[] = customCategories.map(c => ({
    id: c.id,
    name: c.name,
    icon: Tag,
    color: '#38bdf8',
    isCustom: true,
  }));

  return [...presets, ...customs];
};

export function inferCategoryFromSite(siteOrTitle: string, fallback: string = 'other'): string {
  const s = (siteOrTitle || '').toLowerCase().trim();
  if (!s) return fallback;

  // Education (.edu, .ac.*, universities, LMS, learning platforms)
  if (
    /(^|\.)edu(\.|$)|\.ac\.|universit|okul|school|academy|campus|moodle|blackboard|canvas|coursera|udemy|edx|khanacademy|duolingo|quizlet|eba\.gov|osym|yok\.gov|obs\./.test(s)
  ) {
    return 'education';
  }

  // Gaming
  if (
    /steam|epicgames|riotgames|valorant|leagueoflegends|playstation|xbox|nintendo|ubisoft|blizzard|battlenet|roblox|minecraft|gog\.com|itch\.io|rockstargames|faceit|ea\.com|origin|nexusmods/.test(s)
  ) {
    return 'gaming';
  }

  // Entertainment & Streaming
  if (
    /netflix|spotify|youtube|twitch|disney|hbo|max\.com|primevideo|blutv|exxen|gain|mubi|soundcloud|deezer|crunchyroll|kick\.com|imdb|letterboxd|vimeo|tidal|audible/.test(s)
  ) {
    return 'entertainment';
  }

  // Work & Finance (banks, fintech, crypto, dev tools, cloud, email, government)
  if (
    /bank|garanti|isbank|akbank|yapikredi|ziraat|halkbank|vakifbank|qnb|finans|enpara|papara|paycell|iyzico|paypal|stripe|wise|revolut|binance|coinbase|kraken|btcturk|paribu|github|gitlab|bitbucket|figma|slack|jira|atlassian|notion|linear|aws|azure|cloudflare|render|vercel|netlify|digitalocean|heroku|openai|chatgpt|claude|anthropic|microsoft|office|live\.com|outlook|hotmail|proton|turkiye\.gov|edevlet|adobe|canva|dropbox/.test(s)
  ) {
    return 'work';
  }

  // Shopping & E-commerce
  if (
    /amazon|trendyol|hepsiburada|n11|getir|yemeksepeti|sahibinden|dolap|letgo|ebay|aliexpress|temu|shein|ikea|zara|nike|adidas|etsy|walmart|bestbuy|migros|a101|bim|ciceksepeti|decathlon|mediamarkt|vatanbilgisayar/.test(s)
  ) {
    return 'shopping';
  }

  // Social Media
  if (
    /instagram|facebook|twitter|(^|\.)x\.com|tiktok|reddit|linkedin|discord|snapchat|pinterest|whatsapp|telegram|threads|bsky|bluesky|mastodon|tumblr|quora|medium|eksisozluk/.test(s)
  ) {
    return 'social';
  }

  return fallback;
}
