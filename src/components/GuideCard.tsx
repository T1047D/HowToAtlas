import { ArrowUpRight } from 'lucide-react';
import type { Guide, Language } from '../types/atlas';
import { CATEGORIES, DIFFICULTY_LABELS, t } from '../data/uiText';
import { SafeImage } from './SafeImage';

interface GuideCardProps {
  guide: Guide;
  lang: Language;
  onSelect: (guide: Guide) => void;
}

export function GuideCard({ guide, lang, onSelect }: GuideCardProps) {
  const categoryMeta = CATEGORIES.find((c) => c.id === guide.category);
  const categoryLabel = categoryMeta ? t(categoryMeta.label, lang) : guide.category;
  const difficultyLabel = t(DIFFICULTY_LABELS[guide.difficulty], lang);
  const readTimeSuffix = lang === 'bn' ? 'মিনিট' : 'min read';
  const stepSuffix = lang === 'bn' ? 'টি ধাপ' : 'steps';

  return (
    <article className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5">
      <button
        type="button"
        onClick={() => onSelect(guide)}
        className="text-left flex flex-col flex-1 cursor-pointer focus-visible:outline-none"
      >
        <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-slate-200">
          <SafeImage
            src={guide.coverImage}
            alt={t(guide.title, lang)}
            fallbackTitle={t(guide.title, lang)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>

        <div className="p-5 flex flex-col flex-1">
          {/* Quiet unboxed metadata line */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mb-2.5 tabular-nums">
            <span className="font-medium text-blue-700">{categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{difficultyLabel}</span>
            <span aria-hidden="true">·</span>
            <span>
              {guide.readTimeMinutes} {readTimeSuffix}
            </span>
          </div>

          <h3 className="font-display text-lg font-semibold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors mb-2">
            {t(guide.title, lang)}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4 flex-1">
            {t(guide.summary, lang)}
          </p>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 tabular-nums">
            <span>
              {guide.steps.length} {stepSuffix}
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
              {lang === 'bn' ? 'গাইড পড়ুন' : 'Read guide'}
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}
