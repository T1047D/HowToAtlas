import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  Maximize2,
  PlayCircle,
  RotateCcw,
  X,
} from 'lucide-react';
import type { Guide, Language } from '../types/atlas';
import { CATEGORIES, DIFFICULTY_LABELS, UI_TEXT, t } from '../data/uiText';
import { SafeImage } from './SafeImage';
import { GuideCard } from './GuideCard';
import { isSafeEmbedVideoUrl } from '../utils/urlSafety';

interface GuideReaderProps {
  guide: Guide;
  allGuides: Guide[];
  lang: Language;
  onChangeLang: (lang: Language) => void;
  onBack: () => void;
  onSelectGuide: (guide: Guide) => void;
}

export function GuideReader({
  guide,
  allGuides,
  lang,
  onChangeLang,
  onBack,
  onSelectGuide,
}: GuideReaderProps) {
  const storageKey = `howtoatlas_progress_${guide.id}`;
  const [completedSteps, setCompletedSteps] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [lightboxImage, setLightboxImage] = useState<{ src: string; caption: string } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`howtoatlas_progress_${guide.id}`);
      setCompletedSteps(saved ? (JSON.parse(saved) as string[]) : []);
    } catch {
      setCompletedSteps([]);
    }
  }, [guide.id]);

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => {
      const next = prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore storage quota errors
      }
      return next;
    });
  };

  const resetChecklist = () => {
    setCompletedSteps([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  };

  const categoryMeta = CATEGORIES.find((c) => c.id === guide.category);
  const categoryLabel = categoryMeta ? t(categoryMeta.label, lang) : guide.category;
  const difficultyLabel = t(DIFFICULTY_LABELS[guide.difficulty], lang);
  const relatedGuides = allGuides.filter(
    (g) => g.id !== guide.id && (guide.relatedIds.includes(g.id) || g.category === guide.category)
  ).slice(0, 3);

  const totalSteps = guide.steps.length;
  const doneCount = guide.steps.filter((s) => completedSteps.includes(s.id)).length;
  const progressPercent = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Reader Utility Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors cursor-pointer min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{t(UI_TEXT.reader.backToAll, lang)}</span>
        </button>

        {/* Bilingual Switcher inside Reader */}
        <div
          className="inline-flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg"
          role="group"
          aria-label="Tutorial Language"
        >
          <button
            type="button"
            onClick={() => onChangeLang('en')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              lang === 'en'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onChangeLang('bn')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              lang === 'bn'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            বাংলা
          </button>
        </div>
      </div>

      {/* Article Header */}
      <header className="max-w-3xl mb-10">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 mb-3 tabular-nums">
          <span className="font-medium text-blue-700">{categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{difficultyLabel}</span>
          <span aria-hidden="true">·</span>
          <span>
            {guide.readTimeMinutes} {lang === 'bn' ? 'মিনিট পড়া' : 'min read'}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {lang === 'bn' ? 'আপডেট:' : 'Updated'} {guide.updatedAt}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
          {t(guide.title, lang)}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-prose">
          {t(guide.summary, lang)}
        </p>
      </header>

      {/* Main Layout: 70% Reading Column / 30% Sticky Progress & Prerequisites */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <div className="lg:col-span-8 space-y-10">
          {/* Cover Visual */}
          <figure className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
              <SafeImage
                src={guide.coverImage}
                alt={t(guide.title, lang)}
                fallbackTitle={t(guide.title, lang)}
                loading="eager"
                onClick={() =>
                  setLightboxImage({
                    src: guide.coverImage,
                    caption: t(guide.title, lang),
                  })
                }
                className="w-full h-full object-cover cursor-zoom-in"
              />
            </div>
          </figure>

          {/* Prerequisites on mobile/tablet (also visible cleanly above steps) */}
          {guide.prerequisites.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="font-display text-base font-semibold text-slate-900 mb-3">
                {t(UI_TEXT.reader.prerequisites, lang)}
              </h2>
              <ul className="space-y-2.5">
                {guide.prerequisites.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                    <CheckCircle2
                      className="w-4 h-4 text-blue-700 shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <span>{t(item, lang)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Steps Section */}
          <section aria-labelledby="steps-heading" className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2
                id="steps-heading"
                className="font-display text-2xl font-bold text-slate-900"
              >
                {t(UI_TEXT.reader.stepsHeading, lang)}
              </h2>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {doneCount}/{totalSteps}
              </span>
            </div>

            <div className="space-y-6">
              {guide.steps.map((step, index) => {
                const isDone = completedSteps.includes(step.id);
                const stepNumber = String(index + 1).padStart(2, '0');
                return (
                  <article
                    key={step.id}
                    className={`bg-white border rounded-xl p-6 transition-colors ${
                      isDone ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-sm font-medium text-blue-700 tabular-nums shrink-0">
                          {stepNumber}.
                        </span>
                        <h3 className="font-display text-lg font-semibold text-slate-900 leading-snug">
                          {t(step.title, lang)}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleStep(step.id)}
                        aria-pressed={isDone}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shrink-0 cursor-pointer min-h-[36px] ${
                          isDone
                            ? 'bg-emerald-700 border-emerald-700 text-white'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>
                          {isDone
                            ? lang === 'bn'
                              ? 'সম্পন্ন'
                              : 'Done'
                            : lang === 'bn'
                            ? 'চিহ্নিত করুন'
                            : 'Mark done'}
                        </span>
                      </button>
                    </div>

                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-prose mb-4">
                      {t(step.instruction, lang)}
                    </p>

                    {step.screenshot && (
                      <figure className="mt-4 mb-4">
                        <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                          <SafeImage
                            src={step.screenshot}
                            alt={
                              step.screenshotCaption
                                ? t(step.screenshotCaption, lang)
                                : t(step.title, lang)
                            }
                            fallbackTitle={t(step.title, lang)}
                            onClick={() =>
                              setLightboxImage({
                                src: step.screenshot!,
                                caption: step.screenshotCaption
                                  ? t(step.screenshotCaption, lang)
                                  : t(step.title, lang),
                              })
                            }
                            className="w-full max-h-[380px] object-cover cursor-zoom-in"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setLightboxImage({
                                src: step.screenshot!,
                                caption: step.screenshotCaption
                                  ? t(step.screenshotCaption, lang)
                                  : t(step.title, lang),
                              })
                            }
                            aria-label={t(UI_TEXT.reader.zoomHint, lang)}
                            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900/80 text-white text-xs font-medium hover:bg-slate-900 transition-colors cursor-pointer"
                          >
                            <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{lang === 'bn' ? 'বড় করুন' : 'Zoom'}</span>
                          </button>
                        </div>
                        {step.screenshotCaption && (
                          <figcaption className="mt-2 text-xs text-slate-500">
                            {t(step.screenshotCaption, lang)}
                          </figcaption>
                        )}
                      </figure>
                    )}

                    {step.tip && (
                      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50/50 p-4 flex items-start gap-3">
                        <Lightbulb
                          className="w-4 h-4 text-blue-700 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <div className="text-sm text-slate-700 leading-relaxed">
                          <span className="font-semibold text-blue-900 mr-1.5">
                            {t(UI_TEXT.reader.tipLabel, lang)}:
                          </span>
                          <span>{t(step.tip, lang)}</span>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          {/* Video Walkthrough */}
          {guide.videoUrl && isSafeEmbedVideoUrl(guide.videoUrl) && (
            <section
              aria-labelledby="video-heading"
              className="bg-white border border-slate-200 rounded-xl p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-blue-700" aria-hidden="true" />
                  <h2
                    id="video-heading"
                    className="font-display text-lg font-semibold text-slate-900"
                  >
                    {t(UI_TEXT.reader.videoHeading, lang)}
                  </h2>
                </div>
                <a
                  href={guide.videoUrl.replace('/embed/', '/watch?v=')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:underline"
                >
                  <span>{t(UI_TEXT.reader.videoWatchLink, lang)}</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>

              {guide.videoTitle && (
                <p className="text-sm text-slate-600 mb-4">{t(guide.videoTitle, lang)}</p>
              )}

              <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                <iframe
                  src={guide.videoUrl}
                  title={
                    guide.videoTitle ? t(guide.videoTitle, lang) : t(guide.title, lang)
                  }
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </section>
          )}

          {/* Common Mistakes & Fixes */}
          {guide.commonMistakes.length > 0 && (
            <section aria-labelledby="mistakes-heading" className="space-y-4">
              <h2
                id="mistakes-heading"
                className="font-display text-2xl font-bold text-slate-900"
              >
                {t(UI_TEXT.reader.mistakesHeading, lang)}
              </h2>

              <div className="space-y-4">
                {guide.commonMistakes.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 mb-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />
                        <span>{t(UI_TEXT.reader.mistakeLabel, lang)}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {t(item.mistake, lang)}
                      </p>
                    </div>

                    <div className="pt-4 md:pt-0 md:pl-5 border-t md:border-t-0 md:border-l border-slate-200">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                        <span>{t(UI_TEXT.reader.fixLabel, lang)}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {t(item.fix, lang)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky Sidebar: Progress & Quick Step Index */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">
                {t(UI_TEXT.reader.progressLabel, lang)}
              </span>
              <span className="font-mono text-xs font-medium text-blue-700 tabular-nums">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-blue-700 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <ol className="space-y-2 mb-4">
              {guide.steps.map((step, idx) => {
                const isDone = completedSteps.includes(step.id);
                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => toggleStep(step.id)}
                      className="w-full text-left flex items-start gap-2.5 text-xs py-1.5 px-2 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                          isDone
                            ? 'bg-emerald-700 border-emerald-700 text-white'
                            : 'border-slate-300 text-slate-400'
                        }`}
                      >
                        {isDone && <Check className="w-3 h-3" aria-hidden="true" />}
                      </span>
                      <span
                        className={
                          isDone ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'
                        }
                      >
                        {idx + 1}. {t(step.title, lang)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {doneCount > 0 && (
              <button
                type="button"
                onClick={resetChecklist}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t(UI_TEXT.reader.resetChecklist, lang)}</span>
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <section className="mt-16 pt-10 border-t border-slate-200">
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
            {t(UI_TEXT.reader.relatedHeading, lang)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedGuides.map((rel) => (
              <GuideCard
                key={rel.id}
                guide={rel}
                lang={lang}
                onSelect={(g) => {
                  onSelectGuide(g);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal for Screenshots */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImage.caption}
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <span className="text-xs font-medium text-slate-700 truncate pr-4">
                {lightboxImage.caption}
              </span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                aria-label="Close enlarged screenshot"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-slate-950 flex items-center justify-center max-h-[80vh] overflow-auto">
              <SafeImage
                src={lightboxImage.src}
                alt={lightboxImage.caption}
                className="max-h-[78vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
