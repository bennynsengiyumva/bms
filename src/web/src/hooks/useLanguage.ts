'use client';

import { useState, useEffect, useCallback } from 'react';
import { translations, TranslationStructure } from '@/i18n/translations';

export function useLanguage() {
  const [language, setLanguageState] = useState<'en' | 'rw'>('en');

  // Load saved language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bms_language');
      if (saved === 'en' || saved === 'rw') {
        setLanguageState(saved);
      }
    }
  }, []);

  // Set language and persist to localStorage
  const setLanguage = useCallback((lang: 'en' | 'rw') => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bms_language', lang);
    }
  }, []);

  // Get translation function for current language
  const t = translations[language];

  return {
    language,
    setLanguage,
    t,
    translations: translations[language],
  };
}

// Re-export TranslationStructure for convenience
export type { TranslationStructure };