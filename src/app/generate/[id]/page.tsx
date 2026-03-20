'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { GenerationRun, Slide } from '@/types';
import StageProgress from '@/components/StageProgress';
import { SlideCard } from '@/components/SlideCard';
import SourcesPanel from '@/components/SourcesPanel';
import ExportPanel from '@/components/ExportPanel';

type Tab = 'slides' | 'sources' | 'caption' | 'export';

export default function GeneratePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [run, setRun] = useState<GenerationRun | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('slides');
  const [error, setError] = useState('');
  const [captionCopied, setCaptionCopied] = useState(false);

  const fetchRun = useCallback(async () => {
    try {
      const res = await fetch(`/api/generate/${id}`);
      if (!res.ok) {
        setError('Generation not found');
        return;
      }
      const data: GenerationRun = await res.json();
      setRun(data);
      return data;
    } catch {
      setError('Failed to load generation');
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchRun();

    const interval = setInterval(async () => {
      const data = await fetchRun();
      if (data && (data.status === 'completed' || data.status === 'error')) {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [id, fetchRun]);

  async function handleSlideUpdate(index: number, updates: Partial<Slide>) {
    if (!run) return;
    try {
      const res = await fetch(`/api/generate/${run.id}/slide/${index}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated: GenerationRun = await res.json();
        setRun(updated);
      }
    } catch {
      console.error('Failed to update slide');
    }
  }

  async function copyCaption() {
    if (!run?.copy?.caption) return;
    await navigator.clipboard.writeText(run.copy.caption + '\n\n' + run.copy.hashtags.join(' '));
    setCaptionCopied(true);
    setTimeout(() => setCaptionCopied(false), 2000);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <svg className="animate-spin h-10 w-10 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  const isRunning = run.status !== 'completed' && run.status !== 'error';

  const tabs: { key: Tab; label: string; icon: string; disabled?: boolean }[] = [
    { key: 'slides', label: 'Slides', icon: '🎠' },
    { key: 'sources', label: 'Research', icon: '🔍', disabled: !run.research },
    { key: 'caption', label: 'Caption', icon: '📝', disabled: !run.copy },
    { key: 'export', label: 'Export', icon: '📦', disabled: run.status !== 'completed' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors"
            >
              ← Home
            </button>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-sm font-bold">
                ✦
              </div>
              <span className="font-semibold text-white truncate max-w-48 sm:max-w-none">
                {run.brief.topic}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {run.status === 'completed' && (
              <span className="text-xs text-green-400 bg-green-900/30 border border-green-800/50 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Complete
              </span>
            )}
            {isRunning && (
              <span className="text-xs text-indigo-400 bg-indigo-900/30 border border-indigo-800/50 px-3 py-1 rounded-full flex items-center gap-1.5">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Pipeline Progress */}
        {isRunning && (
          <div className="mb-10 bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
            <StageProgress
              status={run.status}
              progress={run.progress}
              currentStage={run.currentStage}
            />
          </div>
        )}

        {/* Error state */}
        {run.status === 'error' && (
          <div className="mb-8 bg-red-950/30 border border-red-800/50 rounded-2xl p-6 text-center">
            <p className="text-red-400 font-semibold text-lg mb-2">Generation Failed</p>
            <p className="text-red-300/70 text-sm mb-4">{run.error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Completed content */}
        {(run.status === 'completed' || run.copy) && (
          <>
            {/* Brief summary bar */}
            <div className="flex flex-wrap gap-2 mb-6 text-xs">
              {[
                { label: '📅', value: run.brief.timeRange === 'custom' ? run.brief.customTimeRange : run.brief.timeRange },
                { label: '👥', value: run.brief.audience || 'General audience' },
                { label: '🎭', value: run.brief.tone },
                { label: '🏷️', value: run.brief.brandName || 'No brand' },
                { label: '🎨', value: run.brief.imageStyle },
              ].map((item) => (
                <span
                  key={item.label}
                  className="bg-slate-800/80 border border-slate-700 text-slate-300 px-3 py-1 rounded-full"
                >
                  {item.label} {item.value}
                </span>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-slate-900/50 p-1 rounded-xl w-fit border border-slate-800">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => !tab.disabled && setActiveTab(tab.key)}
                  disabled={tab.disabled}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : tab.disabled
                        ? 'text-slate-600 cursor-not-allowed'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Slides Tab */}
            {activeTab === 'slides' && run.copy && (
              <div>
                {/* Slide Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                  {run.copy.slides.map((slide, i) => (
                    <SlideCard
                      key={slide.index}
                      slide={slide}
                      brief={run.brief}
                      isActive={activeSlide === i}
                      onUpdate={(updates) => handleSlideUpdate(i, updates)}
                    />
                  ))}
                </div>

                {/* Full slide detail view */}
                {run.copy.slides[activeSlide] && (
                  <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                          Slide {activeSlide + 1} of 7 —{' '}
                          {run.copy.slides[activeSlide].role.toUpperCase()}
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1">
                          {run.copy.slides[activeSlide].title}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        {activeSlide > 0 && (
                          <button
                            onClick={() => setActiveSlide(activeSlide - 1)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                          >
                            ←
                          </button>
                        )}
                        {activeSlide < (run.copy.slides.length - 1) && (
                          <button
                            onClick={() => setActiveSlide(activeSlide + 1)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-300 whitespace-pre-line text-sm leading-relaxed">
                      {run.copy.slides[activeSlide].body}
                    </p>
                    {run.copy.slides[activeSlide].imagePrompt && (
                      <div className="mt-4 p-3 bg-slate-800 rounded-lg">
                        <p className="text-xs text-slate-500 font-semibold mb-1">IMAGE PROMPT</p>
                        <p className="text-xs text-slate-400">{run.copy.slides[activeSlide].imagePrompt}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Slide navigation dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {run.copy.slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        activeSlide === i ? 'bg-indigo-500 scale-125' : 'bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sources Tab */}
            {activeTab === 'sources' && run.research && (
              <div className="max-w-2xl">
                <SourcesPanel research={run.research} />
              </div>
            )}

            {/* Caption Tab */}
            {activeTab === 'caption' && run.copy && (
              <div className="max-w-2xl space-y-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">Instagram Caption</h3>
                    <button
                      onClick={copyCaption}
                      className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5"
                    >
                      {captionCopied ? '✓ Copied!' : '📋 Copy All'}
                    </button>
                  </div>
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                    {run.copy.caption}
                  </pre>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4">Hashtags</h3>
                  <div className="flex flex-wrap gap-2">
                    {run.copy.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-sm px-3 py-1.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Export Tab */}
            {activeTab === 'export' && run.status === 'completed' && (
              <div className="max-w-md">
                <ExportPanel run={run} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
