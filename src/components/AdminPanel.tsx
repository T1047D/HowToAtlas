import { useRef, useState } from 'react';
import {
  Check,
  Code2,
  Copy,
  Download,
  FileUp,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import type {
  AtlasDataset,
  CategoryId,
  DifficultyLevel,
  Guide,
  Language,
} from '../types/atlas';
import { CATEGORIES, DIFFICULTY_LABELS, t } from '../data/uiText';
import type { VerifiedAdminSession } from './AdminAuthGate';

interface AdminPanelProps {
  dataset: AtlasDataset;
  lang: Language;
  session: VerifiedAdminSession;
  onUpdateDataset: (next: AtlasDataset) => void;
  onResetDefault: () => void;
  onPreviewGuide: (guide: Guide) => void;
  onSignOut: () => void;
}

function encodeBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const PRESET_IMAGES = [
  {
    label: 'GitHub Pages / Web Hosting',
    path: './src/assets/images/guide_github_pages_1795743498387.jpg',
  },
  {
    label: '2FA Security Setup',
    path: './src/assets/images/guide_two_factor_auth_1795743499765.jpg',
  },
  {
    label: 'Cloud Folder Structure',
    path: './src/assets/images/guide_cloud_storage_1795743499050.jpg',
  },
  {
    label: 'Image Compression / WebP',
    path: './src/assets/images/guide_web_performance_1795743498746.jpg',
  },
  {
    label: 'Workspace Desk Hero',
    path: './src/assets/images/hero_workspace_desk_1795743497886.jpg',
  },
];

function createEmptyGuide(): Guide {
  const id = `guide-${Date.now()}`;
  const today = new Date().toISOString().slice(0, 10);
  return {
    id,
    slug: id,
    category: 'web-hosting',
    difficulty: 'beginner',
    readTimeMinutes: 5,
    updatedAt: today,
    views: 0,
    popular: false,
    coverImage: PRESET_IMAGES[0].path,
    title: {
      en: 'New Step-by-Step Guide',
      bn: 'নতুন ধাপে ধাপে গাইড',
    },
    summary: {
      en: 'Brief beginner-friendly summary of what this tutorial solves.',
      bn: 'এই টিউটোরিয়ালটি কী সমস্যার সমাধান করে তার সংক্ষিপ্ত বর্ণনা।',
    },
    videoUrl: '',
    videoTitle: { en: '', bn: '' },
    prerequisites: [
      {
        en: 'Basic computer and internet access.',
        bn: 'কম্পিউটার বা মোবাইল এবং ইন্টারনেট সংযোগ।',
      },
    ],
    steps: [
      {
        id: `${id}-step-1`,
        title: { en: 'First Action Step', bn: 'প্রথম ধাপ' },
        instruction: {
          en: 'Describe clearly what the reader should click or configure first.',
          bn: 'পাঠক প্রথমে কী করবেন বা কোথায় ক্লিক করবেন তা সহজভাবে লিখুন।',
        },
        screenshot: PRESET_IMAGES[0].path,
        screenshotCaption: { en: 'Fig. 1 — Step screenshot caption.', bn: 'চিত্র ১ — স্ক্রিনশটের বর্ণনা।' },
        tip: { en: '', bn: '' },
      },
    ],
    commonMistakes: [
      {
        id: `${id}-mistake-1`,
        mistake: {
          en: 'Common mistake beginners make here.',
          bn: 'নতুনরা এখানে যে সাধারণ ভুলটি করেন।',
        },
        fix: {
          en: 'Clear, practical fix to resolve or prevent it.',
          bn: 'ভুলটি এড়ানো বা সমাধান করার সহজ উপায়।',
        },
      },
    ],
    relatedIds: [],
  };
}

export function AdminPanel({
  dataset,
  lang,
  session,
  onUpdateDataset,
  onResetDefault,
  onPreviewGuide,
  onSignOut,
}: AdminPanelProps) {
  const [selectedId, setSelectedId] = useState<string>(dataset.guides[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'editor' | 'json'>('editor');
  const [copied, setCopied] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedGuide =
    dataset.guides.find((g) => g.id === selectedId) || dataset.guides[0] || null;

  const updateGuideField = (updated: Guide) => {
    const today = new Date().toISOString().slice(0, 10);
    const nextGuides = dataset.guides.map((g) =>
      g.id === updated.id ? { ...updated, updatedAt: today } : g
    );
    onUpdateDataset({
      ...dataset,
      updatedAt: today,
      guides: nextGuides,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1800);
  };

  const handleAddNewGuide = () => {
    const fresh = createEmptyGuide();
    const today = new Date().toISOString().slice(0, 10);
    onUpdateDataset({
      ...dataset,
      updatedAt: today,
      guides: [fresh, ...dataset.guides],
    });
    setSelectedId(fresh.id);
    setActiveTab('editor');
  };

  const handleDeleteGuide = (id: string) => {
    if (dataset.guides.length <= 1) return;
    const nextGuides = dataset.guides.filter((g) => g.id !== id);
    onUpdateDataset({
      ...dataset,
      updatedAt: new Date().toISOString().slice(0, 10),
      guides: nextGuides,
    });
    setSelectedId(nextGuides[0]?.id || '');
  };

  const handleDownloadJson = () => {
    const jsonString = JSON.stringify(dataset, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'guides.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(dataset, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard fallback ignored
    }
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as AtlasDataset;
        if (!parsed || !Array.isArray(parsed.guides)) {
          setImportError(
            lang === 'bn'
              ? 'সঠিক guides.json ফরম্যাট নয় (guides অ্যারে পাওয়া যায়নি)।'
              : 'Invalid guides.json format (missing guides array).'
          );
          return;
        }
        onUpdateDataset(parsed);
        if (parsed.guides[0]) setSelectedId(parsed.guides[0].id);
      } catch {
        setImportError(
          lang === 'bn'
            ? 'JSON ফাইল পড়া যায়নি। সিনট্যাক্স চেক করুন।'
            : 'Could not parse JSON file. Please check syntax.'
        );
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handlePublishToGitHub = async () => {
    setPublishing(true);
    setPublishStatus(null);
    const filePath = 'public/data/guides.json';
    const apiBase = `https://api.github.com/repos/${encodeURIComponent(
      session.repoOwner
    )}/${encodeURIComponent(session.repoName)}/contents/${filePath}`;

    try {
      let existingSha: string | undefined;
      const getRes = await fetch(apiBase, {
        headers: {
          Authorization: `Bearer ${session.token}`,
          Accept: 'application/vnd.github+json',
        },
      });

      if (getRes.ok) {
        const existingData = (await getRes.json()) as { sha?: string };
        existingSha = existingData.sha;
      } else if (getRes.status !== 404) {
        setPublishStatus({
          type: 'error',
          message:
            lang === 'bn'
              ? `রিপোজিটরি পড়া যায়নি (HTTP ${getRes.status})। রিপোজিটরি নাম ও টোকেন পারমিশন দেখুন।`
              : `Could not read repository file (HTTP ${getRes.status}). Check repo name and token permissions.`,
        });
        return;
      }

      const content = encodeBase64Utf8(JSON.stringify(dataset, null, 2));
      const putRes = await fetch(apiBase, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `chore: update ${filePath} via HowToAtlas Admin Studio`,
          content,
          ...(existingSha ? { sha: existingSha } : {}),
        }),
      });

      if (!putRes.ok) {
        setPublishStatus({
          type: 'error',
          message:
            lang === 'bn'
              ? `GitHub-এ পাবলিশ করা যায়নি (HTTP ${putRes.status})। টোকেনে Contents: Read & Write পারমিশন আছে কি না দেখুন।`
              : `GitHub publish failed (HTTP ${putRes.status}). Ensure your token has Contents: Read & Write permission.`,
        });
        return;
      }

      setPublishStatus({
        type: 'success',
        message:
          lang === 'bn'
            ? 'সফলভাবে GitHub রিপোজিটরিতে public/data/guides.json আপডেট হয়েছে!'
            : 'Published public/data/guides.json directly to your GitHub repository!',
      });
    } catch {
      setPublishStatus({
        type: 'error',
        message:
          lang === 'bn'
            ? 'নেটওয়ার্ক সমস্যার কারণে GitHub-এ পাঠানো যায়নি। চাইলে guides.json ডাউনলোড করে ম্যানুয়ালি আপলোড করতে পারেন।'
            : 'Network error while reaching GitHub. You can still download guides.json manually.',
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Studio Top Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mb-1">
            <span className="font-mono font-medium text-emerald-700">
              @{session.login}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">
              {session.repoOwner}/{session.repoName}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            {lang === 'bn' ? 'HowToAtlas অ্যাডমিন স্টুডিও' : 'HowToAtlas Publishing Studio'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {lang === 'bn'
              ? 'বাংলা ও ইংরেজি গাইড তৈরি বা এডিট করুন, এরপর সরাসরি GitHub-এ পাবলিশ বা guides.json ডাউনলোড করুন।'
              : 'Author or update bilingual guides visually, then publish directly to GitHub or export guides.json.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'bn' ? 'ভিজ্যুয়াল এডিটর' : 'Visual Editor'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                activeTab === 'json'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>guides.json</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportJson}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer min-h-[38px]"
          >
            <FileUp className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{lang === 'bn' ? 'JSON ইমপোর্ট' : 'Import JSON'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyJson}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer min-h-[38px]"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
            ) : (
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>{copied ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : lang === 'bn' ? 'কপি JSON' : 'Copy JSON'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer min-h-[38px]"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{lang === 'bn' ? 'ডাউনলোড JSON' : 'Download JSON'}</span>
          </button>

          <button
            type="button"
            onClick={handlePublishToGitHub}
            disabled={publishing}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-60 rounded-lg cursor-pointer min-h-[38px]"
          >
            <UploadCloud className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              {publishing
                ? lang === 'bn'
                  ? 'পাবলিশ হচ্ছে...'
                  : 'Publishing...'
                : lang === 'bn'
                ? 'GitHub-এ পাবলিশ'
                : 'Publish to GitHub'}
            </span>
          </button>

          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer min-h-[38px]"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{lang === 'bn' ? 'লক ও সাইন আউট' : 'Lock & Sign Out'}</span>
          </button>
        </div>
      </div>

      {publishStatus && (
        <div
          role="status"
          className={`mb-4 p-3.5 rounded-lg border text-sm ${
            publishStatus.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {publishStatus.message}
        </div>
      )}

      {importError && (
        <div className="mb-4 p-3.5 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800">
          {importError}
        </div>
      )}

      {activeTab === 'json' ? (
        <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <span className="font-mono text-xs text-slate-400">
              public/data/guides.json · {dataset.guides.length} guides
            </span>
            <span className="text-xs text-slate-400">
              {lang === 'bn' ? 'সরাসরি GitHub-এ কমিট করার জন্য প্রস্তুত' : 'Ready to commit to GitHub Pages'}
            </span>
          </div>
          <pre className="font-mono text-xs leading-relaxed overflow-auto max-h-[65vh] text-slate-200">
            {JSON.stringify(dataset, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Guide List Sidebar */}
          <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold text-slate-900">
                {lang === 'bn' ? 'সব গাইড' : 'All Guides'} ({dataset.guides.length})
              </h2>
              <button
                type="button"
                onClick={handleAddNewGuide}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{lang === 'bn' ? 'নতুন গাইড' : 'New Guide'}</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
              {dataset.guides.map((g) => {
                const isSelected = selectedGuide?.id === g.id;
                return (
                  <div
                    key={g.id}
                    className={`flex items-center justify-between gap-2 p-2.5 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(g.id)}
                      className="text-left flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {t(g.title, lang)}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
                        {g.steps.length} steps · {g.updatedAt}
                      </div>
                    </button>

                    {dataset.guides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteGuide(g.id)}
                        aria-label={`Delete ${g.title.en}`}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200">
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{lang === 'bn' ? 'ডিফল্ট ডেটা ফিরিয়ে আনুন' : 'Reset to default guides'}</span>
                </button>
              ) : (
                <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-700">
                    {lang === 'bn' ? 'নিশ্চিত রিসেট করবেন?' : 'Reset all edits?'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onResetDefault();
                        setConfirmReset(false);
                      }}
                      className="px-2.5 py-1 text-xs font-medium bg-red-600 text-white rounded cursor-pointer"
                    >
                      {lang === 'bn' ? 'হ্যাঁ' : 'Yes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded cursor-pointer"
                    >
                      {lang === 'bn' ? 'না' : 'Cancel'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Bilingual Form Editor */}
          {selectedGuide && (
            <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4 text-blue-700" aria-hidden="true" />
                  <span className="text-sm font-semibold text-slate-900">
                    {savedNotice
                      ? lang === 'bn'
                        ? 'স্বয়ংক্রিয়ভাবে সেভ হয়েছে'
                        : 'Saved to browser draft'
                      : lang === 'bn'
                      ? 'গাইড এডিট ফর্ম (তাৎক্ষণিক সেভ)'
                      : 'Guide Editor (auto-saves locally)'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onPreviewGuide(selectedGuide)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer"
                >
                  {lang === 'bn' ? 'লাইভ প্রিভিউ দেখুন' : 'Preview Guide'}
                </button>
              </div>

              {/* Metadata Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                  </label>
                  <select
                    value={selectedGuide.category}
                    onChange={(e) =>
                      updateGuideField({
                        ...selectedGuide,
                        category: e.target.value as CategoryId,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {t(c.label, lang)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {lang === 'bn' ? 'কঠিনতা' : 'Difficulty'}
                  </label>
                  <select
                    value={selectedGuide.difficulty}
                    onChange={(e) =>
                      updateGuideField({
                        ...selectedGuide,
                        difficulty: e.target.value as DifficultyLevel,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900"
                  >
                    {(Object.keys(DIFFICULTY_LABELS) as DifficultyLevel[]).map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {t(DIFFICULTY_LABELS[lvl], lang)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {lang === 'bn' ? 'সময় (মিনিট)' : 'Read Time (min)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={selectedGuide.readTimeMinutes}
                    onChange={(e) =>
                      updateGuideField({
                        ...selectedGuide,
                        readTimeMinutes: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 tabular-nums"
                  />
                </div>

                <div className="flex items-end pb-2">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedGuide.popular}
                      onChange={(e) =>
                        updateGuideField({
                          ...selectedGuide,
                          popular: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-slate-300 text-blue-700"
                    />
                    <span>{lang === 'bn' ? 'জনপ্রিয় তালিকাভুক্ত' : 'Mark Popular'}</span>
                  </label>
                </div>
              </div>

              {/* Bilingual Title & Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    value={selectedGuide.title.en}
                    onChange={(e) =>
                      updateGuideField({
                        ...selectedGuide,
                        title: { ...selectedGuide.title, en: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    শিরোনাম (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={selectedGuide.title.bn}
                    onChange={(e) =>
                      updateGuideField({
                        ...selectedGuide,
                        title: { ...selectedGuide.title, bn: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Summary (English)
                  </label>
                  <textarea
                    rows={2}
                    value={selectedGuide.summary.en}
                    onChange={(e) =>
                      updateGuideField({
                        ...selectedGuide,
                        summary: { ...selectedGuide.summary, en: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    সারসংক্ষেপ (বাংলা)
                  </label>
                  <textarea
                    rows={2}
                    value={selectedGuide.summary.bn}
                    onChange={(e) =>
                      updateGuideField({
                        ...selectedGuide,
                        summary: { ...selectedGuide.summary, bn: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Cover Image & Video Embed */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {lang === 'bn' ? 'কভার ছবি (প্রিসেট বা পাথ)' : 'Cover Image Path'}
                  </label>
                  <select
                    value={
                      PRESET_IMAGES.some((p) => p.path === selectedGuide.coverImage)
                        ? selectedGuide.coverImage
                        : 'custom'
                    }
                    onChange={(e) => {
                      if (e.target.value !== 'custom') {
                        updateGuideField({ ...selectedGuide, coverImage: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white mb-2"
                  >
                    {PRESET_IMAGES.map((img) => (
                      <option key={img.path} value={img.path}>
                        {img.label}
                      </option>
                    ))}
                    <option value="custom">Custom path / URL</option>
                  </select>
                  <input
                    type="text"
                    value={selectedGuide.coverImage}
                    onChange={(e) =>
                      updateGuideField({ ...selectedGuide, coverImage: e.target.value })
                    }
                    placeholder="./assets/screenshots/cover.webp"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {lang === 'bn' ? 'ভিডিও এমবেড URL (ঐচ্ছিক)' : 'Video Embed URL (optional)'}
                  </label>
                  <input
                    type="url"
                    value={selectedGuide.videoUrl || ''}
                    onChange={(e) =>
                      updateGuideField({ ...selectedGuide, videoUrl: e.target.value })
                    }
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg mb-2"
                  />
                  <input
                    type="text"
                    value={selectedGuide.videoTitle?.en || ''}
                    onChange={(e) =>
                      updateGuideField({
                        ...selectedGuide,
                        videoTitle: {
                          en: e.target.value,
                          bn: selectedGuide.videoTitle?.bn || e.target.value,
                        },
                      })
                    }
                    placeholder="Video walkthrough title (EN)"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Steps Editor */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold text-slate-900">
                    {lang === 'bn' ? 'ধাপসমূহ (Steps)' : 'Tutorial Steps'} (
                    {selectedGuide.steps.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const nextStepNum = selectedGuide.steps.length + 1;
                      updateGuideField({
                        ...selectedGuide,
                        steps: [
                          ...selectedGuide.steps,
                          {
                            id: `${selectedGuide.id}-step-${Date.now()}`,
                            title: {
                              en: `Step ${nextStepNum} Title`,
                              bn: `ধাপ ${nextStepNum} শিরোনাম`,
                            },
                            instruction: { en: '', bn: '' },
                            screenshot: '',
                            screenshotCaption: { en: '', bn: '' },
                            tip: { en: '', bn: '' },
                          },
                        ],
                      });
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{lang === 'bn' ? 'ধাপ যোগ করুন' : 'Add Step'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedGuide.steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-blue-700">
                          Step {idx + 1}
                        </span>
                        {selectedGuide.steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              updateGuideField({
                                ...selectedGuide,
                                steps: selectedGuide.steps.filter((s) => s.id !== step.id),
                              })
                            }
                            className="text-xs text-red-600 hover:underline cursor-pointer"
                          >
                            {lang === 'bn' ? 'মুছুন' : 'Remove'}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={step.title.en}
                          onChange={(e) => {
                            const steps = selectedGuide.steps.map((s) =>
                              s.id === step.id
                                ? { ...s, title: { ...s.title, en: e.target.value } }
                                : s
                            );
                            updateGuideField({ ...selectedGuide, steps });
                          }}
                          placeholder="Step title (EN)"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                        />
                        <input
                          type="text"
                          value={step.title.bn}
                          onChange={(e) => {
                            const steps = selectedGuide.steps.map((s) =>
                              s.id === step.id
                                ? { ...s, title: { ...s.title, bn: e.target.value } }
                                : s
                            );
                            updateGuideField({ ...selectedGuide, steps });
                          }}
                          placeholder="ধাপের শিরোনাম (বাংলা)"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                        />
                        <textarea
                          rows={2}
                          value={step.instruction.en}
                          onChange={(e) => {
                            const steps = selectedGuide.steps.map((s) =>
                              s.id === step.id
                                ? {
                                    ...s,
                                    instruction: { ...s.instruction, en: e.target.value },
                                  }
                                : s
                            );
                            updateGuideField({ ...selectedGuide, steps });
                          }}
                          placeholder="Step instruction (EN)"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                        />
                        <textarea
                          rows={2}
                          value={step.instruction.bn}
                          onChange={(e) => {
                            const steps = selectedGuide.steps.map((s) =>
                              s.id === step.id
                                ? {
                                    ...s,
                                    instruction: { ...s.instruction, bn: e.target.value },
                                  }
                                : s
                            );
                            updateGuideField({ ...selectedGuide, steps });
                          }}
                          placeholder="ধাপের বিস্তারিত নির্দেশনা (বাংলা)"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={step.screenshot || ''}
                          onChange={(e) => {
                            const steps = selectedGuide.steps.map((s) =>
                              s.id === step.id ? { ...s, screenshot: e.target.value } : s
                            );
                            updateGuideField({ ...selectedGuide, steps });
                          }}
                          placeholder="Screenshot path (optional, e.g. ./assets/step1.webp)"
                          className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                        />
                        <input
                          type="text"
                          value={step.tip?.en || ''}
                          onChange={(e) => {
                            const steps = selectedGuide.steps.map((s) =>
                              s.id === step.id
                                ? {
                                    ...s,
                                    tip: { en: e.target.value, bn: s.tip?.bn || e.target.value },
                                  }
                                : s
                            );
                            updateGuideField({ ...selectedGuide, steps });
                          }}
                          placeholder="Helpful tip (EN, optional)"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Mistakes Editor */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold text-slate-900">
                    {lang === 'bn' ? 'সাধারণ ভুল ও সমাধান' : 'Common Mistakes & Fixes'} (
                    {selectedGuide.commonMistakes.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      updateGuideField({
                        ...selectedGuide,
                        commonMistakes: [
                          ...selectedGuide.commonMistakes,
                          {
                            id: `${selectedGuide.id}-mistake-${Date.now()}`,
                            mistake: { en: '', bn: '' },
                            fix: { en: '', bn: '' },
                          },
                        ],
                      })
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{lang === 'bn' ? 'ভুল যোগ করুন' : 'Add Mistake'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedGuide.commonMistakes.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            updateGuideField({
                              ...selectedGuide,
                              commonMistakes: selectedGuide.commonMistakes.filter(
                                (item) => item.id !== m.id
                              ),
                            })
                          }
                          className="text-xs text-red-600 hover:underline cursor-pointer"
                        >
                          {lang === 'bn' ? 'মুছুন' : 'Remove'}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={m.mistake.en}
                          onChange={(e) => {
                            const commonMistakes = selectedGuide.commonMistakes.map((item) =>
                              item.id === m.id
                                ? { ...item, mistake: { ...item.mistake, en: e.target.value } }
                                : item
                            );
                            updateGuideField({ ...selectedGuide, commonMistakes });
                          }}
                          placeholder="Common mistake (EN)"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                        />
                        <input
                          type="text"
                          value={m.mistake.bn}
                          onChange={(e) => {
                            const commonMistakes = selectedGuide.commonMistakes.map((item) =>
                              item.id === m.id
                                ? { ...item, mistake: { ...item.mistake, bn: e.target.value } }
                                : item
                            );
                            updateGuideField({ ...selectedGuide, commonMistakes });
                          }}
                          placeholder="সাধারণ ভুল (বাংলা)"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                        />
                        <input
                          type="text"
                          value={m.fix.en}
                          onChange={(e) => {
                            const commonMistakes = selectedGuide.commonMistakes.map((item) =>
                              item.id === m.id
                                ? { ...item, fix: { ...item.fix, en: e.target.value } }
                                : item
                            );
                            updateGuideField({ ...selectedGuide, commonMistakes });
                          }}
                          placeholder="How to fix (EN)"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                        />
                        <input
                          type="text"
                          value={m.fix.bn}
                          onChange={(e) => {
                            const commonMistakes = selectedGuide.commonMistakes.map((item) =>
                              item.id === m.id
                                ? { ...item, fix: { ...item.fix, bn: e.target.value } }
                                : item
                            );
                            updateGuideField({ ...selectedGuide, commonMistakes });
                          }}
                          placeholder="সঠিক সমাধান (বাংলা)"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
