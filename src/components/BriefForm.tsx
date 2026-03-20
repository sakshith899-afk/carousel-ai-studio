'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UserBrief, ColorPalette, Tone, TimeRange, ImageStyle } from '@/types';
import { DEFAULT_PALETTE } from '@/types';

const TONES: { value: Tone; label: string }[] = [
  { value: 'professional', label: '💼 Professional' },
  { value: 'playful', label: '🎉 Playful' },
  { value: 'bold', label: '🔥 Bold' },
  { value: 'educational', label: '📚 Educational' },
  { value: 'inspirational', label: '✨ Inspirational' },
];

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom' },
];

const IMAGE_STYLES: { value: ImageStyle; label: string }[] = [
  { value: 'editorial', label: '📰 Editorial' },
  { value: 'minimal', label: '◻️ Minimal' },
  { value: '3d', label: '🎲 3D Render' },
  { value: 'illustration', label: '🎨 Illustration' },
  { value: 'photography', label: '📷 Photography' },
];

const PALETTE_PRESETS: { name: string; palette: ColorPalette }[] = [
  {
    name: 'Midnight',
    palette: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899', background: '#0f172a', text: '#f8fafc' },
  },
  {
    name: 'Ocean',
    palette: { primary: '#0ea5e9', secondary: '#06b6d4', accent: '#10b981', background: '#0c1a2e', text: '#f0f9ff' },
  },
  {
    name: 'Sunset',
    palette: { primary: '#f97316', secondary: '#ef4444', accent: '#f59e0b', background: '#1c0a00', text: '#fff7ed' },
  },
  {
    name: 'Forest',
    palette: { primary: '#10b981', secondary: '#059669', accent: '#84cc16', background: '#052e16', text: '#f0fdf4' },
  },
  {
    name: 'Rose',
    palette: { primary: '#f43f5e', secondary: '#ec4899', accent: '#a855f7', background: '#1a0010', text: '#fff1f2' },
  },
];

const defaultBrief: UserBrief = {
  topic: '',
  timeRange: '7d',
  audience: '',
  brandName: '',
  tone: 'professional',
  palette: DEFAULT_PALETTE,
  generateImages: true,
  imageStyle: 'editorial',
  ctaGoal: '',
};

export default function BriefForm() {
  const router = useRouter();
  const [brief, setBrief] = useState<UserBrief>(defaultBrief);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);

  const update = <K extends keyof UserBrief>(key: K, value: UserBrief[K]) => {
    setBrief((prev) => ({ ...prev, [key]: value }));
  };

  const updatePalette = (key: keyof ColorPalette, value: string) => {
    setBrief((prev) => ({ ...prev, palette: { ...prev.palette, [key]: value } }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!brief.topic.trim()) {
      setError('Topic is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brief),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to start generation');
      }
      const { id } = await res.json();
      router.push(`/generate/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  }

  const steps = ['Topic & Research', 'Brand & Style', 'Visuals & CTA'];

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                i === step
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : i < step
                    ? 'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-900'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < step ? 'bg-indigo-400 text-white' : ''
                }`}
              >
                {i < step ? '✓' : i + 1}
              </span>
              {s}
            </button>
            {i < steps.length - 1 && <div className="w-8 h-px bg-slate-700" />}
          </div>
        ))}
      </div>

      {/* Step 0: Topic & Research */}
      {step === 0 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Topic <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={brief.topic}
              onChange={(e) => update('topic', e.target.value)}
              placeholder="e.g. AI in healthcare, Web3 gaming, Remote work trends..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Time Range</label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_RANGES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => update('timeRange', t.value)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    brief.timeRange === t.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {brief.timeRange === 'custom' && (
              <input
                type="text"
                value={brief.customTimeRange || ''}
                onChange={(e) => update('customTimeRange', e.target.value)}
                placeholder="e.g. Last 3 months, Q4 2024..."
                className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Target Audience</label>
            <input
              type="text"
              value={brief.audience}
              onChange={(e) => update('audience', e.target.value)}
              placeholder="e.g. startup founders, marketing professionals, Gen Z..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>
      )}

      {/* Step 1: Brand & Style */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Brand Name</label>
            <input
              type="text"
              value={brief.brandName}
              onChange={(e) => update('brandName', e.target.value)}
              placeholder="e.g. TechPulse, CreativeHive..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Tone of Voice</label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => update('tone', t.value)}
                  className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                    brief.tone === t.value
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">Color Palette</label>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {PALETTE_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => update('palette', p.palette)}
                  className={`group relative rounded-xl overflow-hidden h-12 transition-all ${
                    brief.palette.primary === p.palette.primary ? 'ring-2 ring-white' : 'hover:ring-2 hover:ring-slate-500'
                  }`}
                  title={p.name}
                >
                  <div className="flex h-full">
                    <div className="flex-1" style={{ backgroundColor: p.palette.primary }} />
                    <div className="flex-1" style={{ backgroundColor: p.palette.secondary }} />
                    <div className="flex-1" style={{ backgroundColor: p.palette.accent }} />
                  </div>
                  <span className="absolute bottom-0 left-0 right-0 text-center text-white text-xs py-0.5 bg-black/40">
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {(['primary', 'secondary', 'accent', 'background', 'text'] as const).map((key) => (
                <div key={key}>
                  <label className="text-xs text-slate-500 block mb-1 capitalize">{key}</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="color"
                      value={brief.palette[key]}
                      onChange={(e) => updatePalette(key, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={brief.palette[key]}
                      onChange={(e) => updatePalette(key, e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded px-1 py-1 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Visuals & CTA */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
            <div>
              <p className="font-semibold text-white">Generate AI Images</p>
              <p className="text-sm text-slate-400">Create unique visuals for each slide</p>
            </div>
            <button
              type="button"
              onClick={() => update('generateImages', !brief.generateImages)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                brief.generateImages ? 'bg-indigo-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  brief.generateImages ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {brief.generateImages && (
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Image Style</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {IMAGE_STYLES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => update('imageStyle', s.value)}
                    className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                      brief.imageStyle === s.value
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">CTA Goal</label>
            <input
              type="text"
              value={brief.ctaGoal}
              onChange={(e) => update('ctaGoal', e.target.value)}
              placeholder="e.g. Follow for more, DM us to get started, Link in bio..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Preview Summary */}
          <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-sm space-y-2">
            <p className="font-semibold text-slate-300">Generation Summary</p>
            <div className="grid grid-cols-2 gap-2 text-slate-400">
              <span>Topic:</span>
              <span className="text-white font-medium truncate">{brief.topic || '—'}</span>
              <span>Audience:</span>
              <span className="text-white">{brief.audience || 'General'}</span>
              <span>Tone:</span>
              <span className="text-white capitalize">{brief.tone}</span>
              <span>Images:</span>
              <span className="text-white">{brief.generateImages ? `Yes (${brief.imageStyle})` : 'No'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 gap-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              if (step === 0 && !brief.topic.trim()) {
                setError('Topic is required');
                return;
              }
              setError('');
              setStep(step + 1);
            }}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25"
          >
            Next →
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Starting...
              </>
            ) : (
              '🚀 Generate Carousel'
            )}
          </button>
        )}
      </div>
    </form>
  );
}
