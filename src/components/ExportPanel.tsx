'use client';

import { useState } from 'react';
import JSZip from 'jszip';
import type { GenerationRun } from '@/types';

interface Props {
  run: GenerationRun;
}

export default function ExportPanel({ run }: Props) {
  const [exporting, setExporting] = useState<string | null>(null);

  async function downloadJSON() {
    setExporting('json');
    try {
      const res = await fetch(`/api/generate/${run.id}/export`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `carousel-${run.id.slice(0, 8)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(null);
    }
  }

  async function downloadZip() {
    setExporting('zip');
    try {
      const zip = new JSZip();
      const slides = run.copy?.slides || [];

      // Add caption file
      if (run.copy) {
        const caption = `INSTAGRAM CAPTION\n${'='.repeat(50)}\n\n${run.copy.caption}\n\nHASHTAGS\n${'='.repeat(50)}\n\n${run.copy.hashtags.join(' ')}\n`;
        zip.file('caption.txt', caption);
      }

      // Add research file
      if (run.research) {
        const research = `RESEARCH REPORT\n${'='.repeat(50)}\nTopic: ${run.brief.topic}\nGenerated: ${run.research.generatedAt}\n\nSUMMARY\n${'-'.repeat(30)}\n${run.research.summary}\n\nKEY INSIGHTS\n${'-'.repeat(30)}\n${run.research.keyInsights.map((k, i) => `${i + 1}. ${k}`).join('\n')}\n\nFACTS & STATISTICS\n${'-'.repeat(30)}\n${run.research.facts.map((f) => `• ${f.stat} (${f.source})`).join('\n')}\n\nSOURCES\n${'-'.repeat(30)}\n${run.research.sources.map((s) => `• ${s.title}\n  ${s.url}\n  ${s.date}`).join('\n\n')}\n`;
        zip.file('research.txt', research);
      }

      // Add slides data
      const slidesData = slides.map((s) => ({
        slide: s.index + 1,
        role: s.role,
        title: s.title,
        body: s.body,
        imageUrl: s.imageUrl || null,
        imagePrompt: s.imagePrompt || null,
      }));
      zip.file('slides.json', JSON.stringify(slidesData, null, 2));

      // Add brief
      zip.file('brief.json', JSON.stringify(run.brief, null, 2));

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `carousel-${run.id.slice(0, 8)}-bundle.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(null);
    }
  }

  async function downloadSlideImages() {
    setExporting('images');
    try {
      const zip = new JSZip();
      const imgFolder = zip.folder('slides');
      const slides = run.copy?.slides || [];

      await Promise.all(
        slides.map(async (slide) => {
          if (slide.imageUrl && imgFolder) {
            try {
              const res = await fetch(slide.imageUrl);
              const blob = await res.blob();
              const ext = blob.type.includes('png') ? 'png' : 'jpg';
              imgFolder.file(`slide-${slide.index + 1}-${slide.role}.${ext}`, blob);
            } catch {
              // skip if can't fetch
            }
          }
        }),
      );

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `carousel-${run.id.slice(0, 8)}-images.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(null);
    }
  }

  const hasImages = run.copy?.slides.some((s) => s.imageUrl);

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm">Download your carousel assets in multiple formats.</p>

      <div className="space-y-3">
        <button
          onClick={downloadZip}
          disabled={exporting === 'zip'}
          className="w-full flex items-center gap-3 p-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 rounded-xl transition-all group"
        >
          <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center text-xl group-hover:bg-indigo-600/30 transition-colors">
            📦
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-sm">Full Bundle (ZIP)</p>
            <p className="text-xs text-slate-400">Slides data + caption + research + brief</p>
          </div>
          <span className="ml-auto text-slate-400 text-sm">
            {exporting === 'zip' ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              '↓'
            )}
          </span>
        </button>

        <button
          onClick={downloadJSON}
          disabled={exporting === 'json'}
          className="w-full flex items-center gap-3 p-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 rounded-xl transition-all group"
        >
          <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-xl group-hover:bg-violet-600/30 transition-colors">
            📄
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-sm">JSON Export</p>
            <p className="text-xs text-slate-400">Complete run data as structured JSON</p>
          </div>
          <span className="ml-auto text-slate-400 text-sm">
            {exporting === 'json' ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              '↓'
            )}
          </span>
        </button>

        {hasImages && (
          <button
            onClick={downloadSlideImages}
            disabled={exporting === 'images'}
            className="w-full flex items-center gap-3 p-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 rounded-xl transition-all group"
          >
            <div className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center text-xl group-hover:bg-pink-600/30 transition-colors">
              🖼️
            </div>
            <div className="text-left">
              <p className="font-semibold text-white text-sm">Slide Images (ZIP)</p>
              <p className="text-xs text-slate-400">All generated images packed as ZIP</p>
            </div>
            <span className="ml-auto text-slate-400 text-sm">
              {exporting === 'images' ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                '↓'
              )}
            </span>
          </button>
        )}
      </div>

      {/* Hashtags preview */}
      {run.copy?.hashtags && (
        <div className="mt-4 p-4 bg-slate-800 rounded-xl">
          <p className="text-xs font-semibold text-slate-400 mb-2">HASHTAGS</p>
          <div className="flex flex-wrap gap-1.5">
            {run.copy.hashtags.map((tag) => (
              <span key={tag} className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
