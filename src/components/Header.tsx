import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { Language } from '../types/atlas';
import { UI_TEXT, t } from '../data/uiText';

interface HeaderProps {
  lang: Language;
  viewMode: 'public' | 'admin';
  onNavigateSection: (sectionId: string) => void;
  onToggleAdmin: () => void;
  onGoHome: () => void;
}

export function Header({
  lang,
  viewMode,
  onNavigateSection,
  onToggleAdmin,
  onGoHome,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileOpen(false);
    onNavigateSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => {
            setMobileOpen(false);
            onGoHome();
          }}
          className="font-display text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-blue-700 transition-colors cursor-pointer"
        >
          HowToAtlas
        </button>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          <button
            type="button"
            onClick={() => handleNavClick('catalog')}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t(UI_TEXT.nav.guides, lang)}
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('categories')}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t(UI_TEXT.nav.categories, lang)}
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('popular')}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t(UI_TEXT.nav.popular, lang)}
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('publishing')}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t(UI_TEXT.nav.publishing, lang)}
          </button>
        </nav>

        {/* Zone 3: 1 primary action (public visitors see Browse Guides; verified admin sees View Public Site) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              if (viewMode === 'admin') {
                onToggleAdmin();
              } else {
                onNavigateSection('catalog');
              }
            }}
            className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
          >
            {viewMode === 'admin'
              ? t(UI_TEXT.nav.backToSite, lang)
              : t(UI_TEXT.hero.primaryBtn, lang)}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2">
          <button
            type="button"
            onClick={() => handleNavClick('catalog')}
            className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            {t(UI_TEXT.nav.guides, lang)}
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('categories')}
            className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            {t(UI_TEXT.nav.categories, lang)}
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('popular')}
            className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            {t(UI_TEXT.nav.popular, lang)}
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('publishing')}
            className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            {t(UI_TEXT.nav.publishing, lang)}
          </button>
          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                if (viewMode === 'admin') {
                  onToggleAdmin();
                } else {
                  onNavigateSection('catalog');
                }
              }}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer min-h-[44px]"
            >
              {viewMode === 'admin'
                ? t(UI_TEXT.nav.backToSite, lang)
                : t(UI_TEXT.hero.primaryBtn, lang)}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
