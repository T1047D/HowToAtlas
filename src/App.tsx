import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Globe, Search, SlidersHorizontal, X } from 'lucide-react';
import type { AtlasDataset, CategoryId, Guide, Language } from './types/atlas';
import { INITIAL_DATASET } from './data/initialGuides';
import { CATEGORIES, UI_TEXT, t } from './data/uiText';
import { Header } from './components/Header';
import { GuideCard } from './components/GuideCard';
import { GuideReader } from './components/GuideReader';
import { AdminPanel } from './components/AdminPanel';
import { AdminAuthGate, type VerifiedAdminSession } from './components/AdminAuthGate';
import { SafeImage } from './components/SafeImage';

const DATASET_STORAGE_KEY = 'howtoatlas_dataset_v1';
const LANG_STORAGE_KEY = 'howtoatlas_lang';
const HERO_IMAGE = './src/assets/images/hero_workspace_desk_1795743497886.jpg';

function isAdminHash(): boolean {
  if (typeof window === 'undefined') return false;
  const h = window.location.hash.toLowerCase();
  return h === '#admin' || h.startsWith('#admin/');
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      return saved === 'bn' ? 'bn' : 'en';
    } catch {
      return 'en';
    }
  });

  const [dataset, setDataset] = useState<AtlasDataset>(INITIAL_DATASET);
  const [inAdminRoute, setInAdminRoute] = useState<boolean>(() => isAdminHash());
  const [adminSession, setAdminSession] = useState<VerifiedAdminSession | null>(null);
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryId>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'latest'>('popular');

  // Sync with browser hash (#admin opens owner verification gate)
  useEffect(() => {
    const onHashChange = () => {
      const adminRequested = isAdminHash();
      setInAdminRoute(adminRequested);
      if (adminRequested) {
        setActiveGuideId(null);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Load static ./data/guides.json for public visitors (GitHub Pages compatible)
  useEffect(() => {
    fetch('./data/guides.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AtlasDataset | null) => {
        if (data && Array.isArray(data.guides) && data.guides.length > 0) {
          setDataset(data);
        }
      })
      .catch(() => {
        // Keep bundled INITIAL_DATASET fallback
      });
  }, []);

  // When verified owner enters Admin Studio, restore any saved local editing draft
  useEffect(() => {
    if (!adminSession) return;
    try {
      const saved = localStorage.getItem(DATASET_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AtlasDataset;
        if (parsed && Array.isArray(parsed.guides) && parsed.guides.length > 0) {
          setDataset(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, [adminSession]);

  const handleLanguageChange = (nextLang: Language) => {
    setLang(nextLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, nextLang);
    } catch {
      // ignore
    }
  };

  const handleUpdateDataset = (next: AtlasDataset) => {
    setDataset(next);
    if (adminSession) {
      try {
        localStorage.setItem(DATASET_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
    }
  };

  const handleResetDefault = () => {
    setDataset(INITIAL_DATASET);
    try {
      localStorage.removeItem(DATASET_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const exitAdminRoute = (signOut = false) => {
    if (signOut) {
      setAdminSession(null);
    }
    setInAdminRoute(false);
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeGuide = useMemo(
    () => dataset.guides.find((g) => g.id === activeGuideId) || null,
    [dataset.guides, activeGuideId]
  );

  const popularGuides = useMemo(
    () =>
      dataset.guides
        .filter((g) => g.popular)
        .sort((a, b) => b.views - a.views)
        .slice(0, 3),
    [dataset.guides]
  );

  const filteredGuides = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return dataset.guides
      .filter((guide) => {
        if (selectedCategory !== 'all' && guide.category !== selectedCategory) {
          return false;
        }
        if (!q) return true;

        const haystack = [
          guide.title.en,
          guide.title.bn,
          guide.summary.en,
          guide.summary.bn,
          ...guide.steps.flatMap((s) => [
            s.title.en,
            s.title.bn,
            s.instruction.en,
            s.instruction.bn,
          ]),
          ...guide.commonMistakes.flatMap((m) => [
            m.mistake.en,
            m.mistake.bn,
            m.fix.en,
            m.fix.bn,
          ]),
        ]
          .join(' ')
          .toLowerCase();

        return haystack.includes(q);
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          if (a.popular !== b.popular) return a.popular ? -1 : 1;
          return b.views - a.views;
        }
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [dataset.guides, searchQuery, selectedCategory, sortBy]);

  const avgReadTime = useMemo(() => {
    if (dataset.guides.length === 0) return 0;
    const sum = dataset.guides.reduce((acc, g) => acc + g.readTimeMinutes, 0);
    return Math.round(sum / dataset.guides.length);
  }, [dataset.guides]);

  const scrollToSection = (sectionId: string) => {
    if (inAdminRoute) {
      exitAdminRoute(false);
    }
    setActiveGuideId(null);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  const openGuide = (guide: Guide) => {
    if (inAdminRoute) {
      exitAdminRoute(false);
    }
    setActiveGuideId(guide.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        lang={lang}
        viewMode={inAdminRoute && adminSession ? 'admin' : 'public'}
        onNavigateSection={scrollToSection}
        onToggleAdmin={() => exitAdminRoute(false)}
        onGoHome={() => {
          exitAdminRoute(false);
          setActiveGuideId(null);
        }}
      />

      {inAdminRoute ? (
        adminSession ? (
          <AdminPanel
            dataset={dataset}
            lang={lang}
            session={adminSession}
            onUpdateDataset={handleUpdateDataset}
            onResetDefault={handleResetDefault}
            onPreviewGuide={(guide) => openGuide(guide)}
            onSignOut={() => exitAdminRoute(true)}
          />
        ) : (
          <AdminAuthGate
            lang={lang}
            onVerified={(session) => setAdminSession(session)}
            onBackToPublic={() => exitAdminRoute(false)}
          />
        )
      ) : activeGuide ? (
        <GuideReader
          guide={activeGuide}
          allGuides={dataset.guides}
          lang={lang}
          onChangeLang={handleLanguageChange}
          onBack={() => {
            setActiveGuideId(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectGuide={openGuide}
        />
      ) : (
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-white border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                {/* Left Hero Column */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                      <p className="text-xs font-medium text-slate-500">
                        {t(UI_TEXT.hero.kicker, lang)}
                      </p>

                      {/* Clean Language Segmented Switch */}
                      <div
                        className="inline-flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg"
                        role="group"
                        aria-label="Language Selector"
                      >
                        <button
                          type="button"
                          onClick={() => handleLanguageChange('en')}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            lang === 'en'
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          English
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLanguageChange('bn')}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            lang === 'bn'
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          বাংলা
                        </button>
                      </div>
                    </div>

                    <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-[1.12] max-w-2xl mb-5">
                      {t(UI_TEXT.hero.title, lang)}
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-prose mb-8">
                      {t(UI_TEXT.hero.subtitle, lang)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => scrollToSection('catalog')}
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
                    >
                      <span>{t(UI_TEXT.hero.primaryBtn, lang)}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={() => scrollToSection('popular')}
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
                    >
                      <span>{t(UI_TEXT.nav.popular, lang)}</span>
                    </button>
                  </div>
                </div>

                {/* Right Hero Visual */}
                <div className="lg:col-span-5">
                  <div className="h-full min-h-[260px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <SafeImage
                      src={HERO_IMAGE}
                      alt={t(UI_TEXT.hero.imageCaption, lang)}
                      fallbackTitle="HowToAtlas Tutorial Workspace"
                      loading="eager"
                      className="w-full h-full lg:h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Full-Width 4-Column Atlas Summary Strip */}
              <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                    {dataset.guides.length}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {t(UI_TEXT.stats.totalGuides, lang)}
                  </div>
                </div>

                <div>
                  <div className="font-display text-2xl font-bold text-slate-900">
                    EN · বাংলা
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {t(UI_TEXT.stats.bilingualReady, lang)}
                  </div>
                </div>

                <div>
                  <div className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                    {avgReadTime} {lang === 'bn' ? 'মিনিট' : 'min'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {t(UI_TEXT.stats.avgReadTime, lang)}
                  </div>
                </div>

                <div>
                  <div className="font-display text-2xl font-bold text-slate-900">
                    Static JSON
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {t(UI_TEXT.stats.staticHosting, lang)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Popular Guides Spotlight */}
          {popularGuides.length > 0 && (
            <section id="popular" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                    {t(UI_TEXT.sections.popularHeading, lang)}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 mt-1">
                    {t(UI_TEXT.sections.popularSub, lang)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {popularGuides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} lang={lang} onSelect={openGuide} />
                ))}
              </div>
            </section>
          )}

          {/* Categories Overview */}
          <section
            id="categories"
            className="bg-white border-y border-slate-200 py-12 sm:py-16"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="mb-8">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                  {t(UI_TEXT.sections.categoriesHeading, lang)}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-1">
                  {t(UI_TEXT.sections.categoriesSub, lang)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {CATEGORIES.map((category, idx) => {
                  const count = dataset.guides.filter((g) => g.category === category.id).length;
                  const isActive = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        scrollToSection('catalog');
                      }}
                      className={`text-left p-5 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between ${
                        isActive
                          ? 'bg-blue-50/70 border-blue-300'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3 tabular-nums">
                          <span className="font-mono font-medium text-blue-700">
                            0{idx + 1}
                          </span>
                          <span>
                            {count} {lang === 'bn' ? 'টি গাইড' : count === 1 ? 'guide' : 'guides'}
                          </span>
                        </div>
                        <h3 className="font-display text-base font-semibold text-slate-900 mb-1.5">
                          {t(category.label, lang)}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {t(category.description, lang)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Complete Tutorial Directory with Search & Filters */}
          <section id="catalog" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                  {t(UI_TEXT.sections.catalogHeading, lang)}
                </h2>
                <p className="text-sm text-slate-500 mt-1 tabular-nums">
                  {filteredGuides.length} {t(UI_TEXT.toolbar.resultsCount, lang)}
                </p>
              </div>

              {/* Sort Control */}
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg self-start">
                <button
                  type="button"
                  onClick={() => setSortBy('popular')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    sortBy === 'popular'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t(UI_TEXT.toolbar.sortPopular, lang)}
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('latest')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    sortBy === 'latest'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t(UI_TEXT.toolbar.sortLatest, lang)}
                </button>
              </div>
            </div>

            {/* Search + Category Filter Toolbar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 space-y-4">
              <div className="relative">
                <Search
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t(UI_TEXT.toolbar.searchPlaceholder, lang)}
                  aria-label={t(UI_TEXT.toolbar.searchPlaceholder, lang)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5" role="tablist">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t(UI_TEXT.toolbar.allCategories, lang)}
                  </button>
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedCategory === category.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {t(category.label, lang)}
                    </button>
                  ))}
                </div>

                {(searchQuery || selectedCategory !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:underline cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t(UI_TEXT.toolbar.clearFilters, lang)}</span>
                  </button>
                )}
              </div>
            </div>

            {filteredGuides.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-display text-lg font-semibold text-slate-900 mb-1">
                  {t(UI_TEXT.empty.title, lang)}
                </h3>
                <p className="text-sm text-slate-600 mb-5 max-w-md mx-auto">
                  {t(UI_TEXT.empty.description, lang)}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer"
                >
                  {t(UI_TEXT.toolbar.clearFilters, lang)}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} lang={lang} onSelect={openGuide} />
                ))}
              </div>
            )}
          </section>

          {/* Editorial Quality Standards for Readers (No Public Admin Links) */}
          <section
            id="publishing"
            className="bg-white border-t border-slate-200 py-12 sm:py-16"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="max-w-2xl mb-10">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                  {t(UI_TEXT.sections.publishingHeading, lang)}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {t(UI_TEXT.sections.publishingSub, lang)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div className="font-mono text-xs font-semibold text-blue-700 mb-2">
                    01. {lang === 'bn' ? 'আসল স্ক্রিনশট' : 'Real Verified Screenshots'}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {lang === 'bn'
                      ? 'প্রতিটি ধাপে স্পষ্ট স্ক্রিনশট ও বড় করে দেখার সুবিধা থাকে যাতে নতুনরা সহজে মিলিয়ে নিতে পারেন।'
                      : 'Every major action includes crisp screenshots you can enlarge, so beginners never have to guess where to click.'}
                  </p>
                </div>

                <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div className="font-mono text-xs font-semibold text-blue-700 mb-2">
                    02. {lang === 'bn' ? 'সাধারণ ভুলের সমাধান' : 'Common Mistakes Included'}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {lang === 'bn'
                      ? 'গাইডের শেষে নতুনদের সবচেয়ে বেশি হওয়া ভুলগুলো এবং সেগুলো ঠিক করার সহজ উপায় দেওয়া থাকে।'
                      : 'Each guide highlights the exact mistakes beginners hit most often and pairs every issue with a direct fix.'}
                  </p>
                </div>

                <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div className="font-mono text-xs font-semibold text-blue-700 mb-2">
                    03. {lang === 'bn' ? 'তাৎক্ষণিক বাংলা ও ইংরেজি' : 'Instant English & Bangla'}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {lang === 'bn'
                      ? 'একই টিউটোরিয়াল পড়ার মাঝখানেই এক ক্লিকে ইংরেজি বা বাংলায় বদলে নেওয়া যায়।'
                      : 'Switch between English and Bangla mid-tutorial without losing your step progress or place on the page.'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Clean Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-display text-base font-bold text-slate-900">HowToAtlas</div>
            <p className="text-xs text-slate-500 mt-1">{t(UI_TEXT.footer.tagline, lang)}</p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600">
            <button
              type="button"
              onClick={() => handleLanguageChange(lang === 'en' ? 'bn' : 'en')}
              className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-blue-700 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{lang === 'en' ? 'বাংলায় দেখুন' : 'Switch to English'}</span>
            </button>
            <span>{t(UI_TEXT.footer.copyright, lang)}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
