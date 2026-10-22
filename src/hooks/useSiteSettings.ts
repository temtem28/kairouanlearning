import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface SiteSettings {
  // Branding
  site_name: string;
  site_tagline: string;
  logo_url: string;
  favicon_emoji: string;
  accent_color: string;       // hex — maps to --gold
  bg_color: string;           // hex — beige body background

  // Homepage hero
  hero_title: string;
  hero_subtitle: string;
  arabic_quote: string;
  arabic_translation: string;
  cta_primary_label: string;
  cta_primary_link: string;
  cta_secondary_label: string;
  cta_secondary_link: string;

  // Stats
  stat1_value: string; stat1_label: string;
  stat2_value: string; stat2_label: string;
  stat3_value: string; stat3_label: string;
  stat4_value: string; stat4_label: string;

  // Contact
  contact_email: string;
  whatsapp_url: string;
  whatsapp_display: string;
  response_time: string;

  // Footer
  footer_description: string;
  footer_copyright: string;

  // Legal
  company_name: string;
  company_country: string;

  // Platform
  currency_symbol: string;
  enable_quiz: boolean;
  enable_certificates: boolean;
  require_email_confirmation: boolean;
  allow_self_registration: boolean;
  default_role: string;

  // Lesson page
  lesson_completion_text: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'Kairouan Academy',
  site_tagline: 'Des sciences islamiques enseignées par des savants certifiés.',
  logo_url: '',
  favicon_emoji: '🕌',
  accent_color: '#b8892c',
  bg_color: '#e8d9c0',

  hero_title: 'Des sciences\nislamiques\nauthentiques',
  hero_subtitle: 'Kairouan Academy propose des formations rigoureuses en sciences islamiques, dispensées par des savants issus de chaînes de transmission reconnues.',
  arabic_quote: 'العلم قبل القول والعمل',
  arabic_translation: 'La science avant la parole et l\'action',
  cta_primary_label: 'Découvrir les formations',
  cta_primary_link: '/catalogue',
  cta_secondary_label: 'Se connecter',
  cta_secondary_link: '/connexion',

  stat1_value: '250+', stat1_label: 'Étudiants inscrits',
  stat2_value: '110h+', stat2_label: 'Heures de contenu',
  stat3_value: '5', stat3_label: 'Disciplines',
  stat4_value: '100%', stat4_label: 'Savants certifiés',

  contact_email: 'kairouan.editions@gmail.com',
  whatsapp_url: 'https://wa.me/32XXXXXXXXX',
  whatsapp_display: 'Nous contacter sur WhatsApp',
  response_time: 'Nous répondons généralement sous 24 à 48 heures ouvrées.',

  footer_description: 'Kairouan Academy — formations en sciences islamiques par des savants issus de chaînes de transmission reconnues.',
  footer_copyright: '© 2025 Kairouan Éditions. Tous droits réservés.',

  company_name: 'Kairouan Éditions',
  company_country: 'Belgique',

  currency_symbol: '€',
  enable_quiz: true,
  enable_certificates: true,
  require_email_confirmation: false,
  allow_self_registration: true,
  default_role: 'student',

  lesson_completion_text: 'Marquer comme terminée',
};

let cachedSettings: SiteSettings | null = null;

export async function loadSettings(): Promise<SiteSettings> {
  if (cachedSettings) return cachedSettings;
  try {
    const { data } = await supabase.from('site_settings').select('key, value');
    if (!data || data.length === 0) return { ...DEFAULT_SETTINGS };
    const merged = { ...DEFAULT_SETTINGS };
    for (const row of data) {
      (merged as any)[row.key] = row.value;
    }
    cachedSettings = merged;
    return merged;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings: Partial<SiteSettings>): Promise<void> {
  cachedSettings = null;
  const rows = Object.entries(settings).map(([key, value]) => ({ key, value }));
  await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
}

export function applySettingsToDOM(s: SiteSettings): void {
  const root = document.documentElement;
  // Parse hex to HSL for Tailwind CSS variables
  const hexToHsl = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  if (s.accent_color && s.accent_color.startsWith('#')) {
    root.style.setProperty('--gold-hsl', hexToHsl(s.accent_color));
    root.style.setProperty('--accent-color', s.accent_color);
  }
  if (s.bg_color && s.bg_color.startsWith('#')) {
    root.style.setProperty('--bg-color', s.bg_color);
  }
  if (s.site_name) {
    document.title = s.site_name;
  }
}

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  useEffect(() => {
    loadSettings().then(s => {
      setSettings(s);
      applySettingsToDOM(s);
    });
  }, []);
  return settings;
}
