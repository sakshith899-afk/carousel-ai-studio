'use client';

import { useState } from 'react';
import type { Slide, UserBrief } from '@/types';

interface Props {
  slide: Slide;
  brief: UserBrief;
  isActive: boolean;
  onUpdate: (updates: Partial<Slide>) => void;
}

const ROLE_LABELS: Record<string, string> = {
  hook: 'Hook',
  context: 'Context',
  insight1: 'Insight 1',
  insight2: 'Insight 2',
  insight3: 'Insight 3',
  takeaway: 'Takeaway',
  cta: 'CTA',
};

export function SlideCard({ slide, brief, isActive, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(slide.title);
  const [localBody, setLocalBody] = useState(slide.body);
  const [saving, setSaving] = useState(false);

  const bg = slide.backgroundColor || brief.palette.primary;
  const textColor = brief.palette.text;

  async function handleSave() {
    setSaving(true);
    onUpdate({ title: localTitle, body: localBody });
    await new Promise((r) => setTimeout(r, 300));
    setSaving(false);
    setEditing(false);
  }

  function handleCancel() {
    setLocalTitle(slide.title);
    setLocalBody(slide.body);
    setEditing(false);
  }

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 ${
        isActive ? 'ring-4 ring-indigo-500 shadow-xl shadow-indigo-500/20 scale-[1.02]' : 'hover:scale-[1.01]'
      }`}
    >
      {/* Slide Visual */}
      <div
        className="relative aspect-square flex flex-col items-start justify-end p-6"
        style={{ backgroundColor: bg }}
      >
        {/* Slide number badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="bg-black/30 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
            {slide.index + 1} / 7
          </span>
          <span className="bg-black/20 backdrop-blur-sm text-white/80 text-xs px-2 py-1 rounded-full">
            {ROLE_LABELS[slide.role] || slide.role}
          </span>
        </div>

        {/* Background image overlay */}
        {slide.imageUrl && (
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Content */}
        <div className="relative z-10 w-full">
          <h3 className="text-white font-bold text-lg leading-tight mb-2 drop-shadow-lg">{slide.title}</h3>
          <p className="text-white/85 text-sm leading-relaxed drop-shadow whitespace-pre-line line-clamp-4">
            {slide.body}
          </p>
        </div>
      </div>

      {/* Edit Panel */}
      {editing ? (
        <div className="bg-slate-800 p-4 space-y-3 border-t border-slate-700">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Title</label>
            <input
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Body</label>
            <textarea
              value={localBody}
              onChange={(e) => setLocalBody(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium rounded-lg py-2 transition-all"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-lg py-2 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/80 px-4 py-3 flex items-center justify-between border-t border-slate-700">
          <span className="text-slate-400 text-xs">Slide {slide.index + 1}</span>
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
          >
            ✏️ Edit
          </button>
        </div>
      )}
    </div>
  );
}
