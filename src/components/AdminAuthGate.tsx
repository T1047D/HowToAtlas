import { useState } from 'react';
import { ArrowLeft, KeyRound, Lock, ShieldCheck } from 'lucide-react';
import type { Language } from '../types/atlas';

export interface VerifiedAdminSession {
  token: string;
  login: string;
  avatarUrl: string;
  repoOwner: string;
  repoName: string;
}

interface AdminAuthGateProps {
  lang: Language;
  onVerified: (session: VerifiedAdminSession) => void;
  onBackToPublic: () => void;
}

const ALLOWED_OWNER = 't1047d';
const DEFAULT_REPO = 'HowToAtlas';

export function AdminAuthGate({
  lang,
  onVerified,
  onBackToPublic,
}: AdminAuthGateProps) {
  const [token, setToken] = useState('');
  const [repoName, setRepoName] = useState(DEFAULT_REPO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const cleanToken = token.trim();
    const cleanRepo = repoName.trim() || DEFAULT_REPO;
    if (!cleanToken) {
      setError(
        lang === 'bn'
          ? 'অনুগ্রহ করে আপনার GitHub Personal Access Token দিন।'
          : 'Please enter your GitHub Personal Access Token.'
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: 'application/vnd.github+json',
        },
      });

      if (!response.ok) {
        setError(
          lang === 'bn'
            ? 'টোকেনটি সঠিক নয় অথবা মেয়াদ শেষ হয়েছে।'
            : 'Invalid or expired GitHub token.'
        );
        return;
      }

      const user = (await response.json()) as { login?: string; avatar_url?: string };
      if (!user.login || user.login.toLowerCase() !== ALLOWED_OWNER.toLowerCase()) {
        setError(
          lang === 'bn'
            ? `অ্যাক্সেস প্রত্যাখ্যান করা হয়েছে: এই প্যানেল কেবল রিপোজিটরি মালিক (@${ALLOWED_OWNER}) এর জন্য।`
            : `Access denied: only repository owner (@${ALLOWED_OWNER}) can open Admin Studio.`
        );
        return;
      }

      onVerified({
        token: cleanToken,
        login: user.login,
        avatarUrl: user.avatar_url || '',
        repoOwner: ALLOWED_OWNER,
        repoName: cleanRepo,
      });
    } catch {
      setError(
        lang === 'bn'
          ? 'GitHub API-এর সাথে সংযোগ করা যায়নি। ইন্টারনেট সংযোগ দেখুন।'
          : 'Could not reach GitHub API. Please check your connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700">
            <Lock className="w-4 h-4" aria-hidden="true" />
            <span>
              {lang === 'bn' ? 'মালিক ভেরিফিকেশন গেট' : 'Owner Verification Gate'}
            </span>
          </div>

          <button
            type="button"
            onClick={onBackToPublic}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{lang === 'bn' ? 'সাইটে ফিরুন' : 'Back to site'}</span>
          </button>
        </div>

        <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
          {lang === 'bn' ? 'HowToAtlas অ্যাডমিন লগইন' : 'HowToAtlas Admin Access'}
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {lang === 'bn'
            ? `নিরাপত্তার জন্য এই প্যানেল কেবল রিপোজিটরি মালিক (@${ALLOWED_OWNER})-এর GitHub Personal Access Token দিয়ে আনলক করা যাবে। টোকেনটি কেবল মেমোরিতে থাকবে, ব্রাউজার স্টোরেজে সেভ হবে না।`
            : `For security, this studio only unlocks when GitHub verifies your token belongs to repository owner @${ALLOWED_OWNER}. Your token stays strictly in memory for this session.`}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="gh-repo-name"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              {lang === 'bn' ? 'রিপোজিটরি' : 'GitHub Repository'}
            </label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 text-sm font-mono bg-slate-100 border border-slate-200 rounded-lg text-slate-600">
                {ALLOWED_OWNER} /
              </span>
              <input
                id="gh-repo-name"
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                className="flex-1 px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg bg-white text-slate-900"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="gh-pat-input"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              GitHub Personal Access Token
            </label>
            <div className="relative">
              <KeyRound
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="gh-pat-input"
                type="password"
                autoComplete="off"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="github_pat_..."
                className="w-full pl-9 pr-3 py-2.5 text-sm font-mono border border-slate-200 rounded-lg bg-white text-slate-900"
              />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="p-3 rounded-lg border border-red-200 bg-red-50 text-xs text-red-800 leading-relaxed"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-60 rounded-lg transition-colors cursor-pointer min-h-[44px]"
          >
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>
              {loading
                ? lang === 'bn'
                  ? 'যাচাই করা হচ্ছে...'
                  : 'Verifying with GitHub...'
                : lang === 'bn'
                ? 'মালিকানা যাচাই ও আনলক করুন'
                : 'Verify Owner & Unlock Studio'}
            </span>
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-200 text-xs text-slate-500 leading-relaxed">
          {lang === 'bn' ? (
            <>
              টোকেন তৈরি করতে GitHub → Settings → Developer settings → Fine-grained tokens থেকে{' '}
              <span className="font-mono text-slate-700">{ALLOWED_OWNER}/{DEFAULT_REPO}</span>-এর
              জন্য <span className="font-medium text-slate-700">Contents: Read and write</span>{' '}
              পারমিশন দিন।
            </>
          ) : (
            <>
              Create a fine-grained token under GitHub Settings → Developer settings with{' '}
              <span className="font-medium text-slate-700">Contents: Read &amp; Write</span> on{' '}
              <span className="font-mono text-slate-700">{ALLOWED_OWNER}/{DEFAULT_REPO}</span> for
              1-click live publishing.
            </>
          )}
        </div>
      </div>
    </main>
  );
}
