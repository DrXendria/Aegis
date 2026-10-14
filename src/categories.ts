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
