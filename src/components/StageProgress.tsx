'use client';

import type { GenerationStatus } from '@/types';

interface Stage {
  key: GenerationStatus;
  label: string;
  icon: string;
  description: string;
}

const STAGES: Stage[] = [
  { key: 'researching', label: 'Research', icon: '🔍', description: 'Gathering fresh data & insights' },
  { key: 'writing', label: 'Copywriting', icon: '✍️', description: 'Writing 7-slide narrative arc' },
  { key: 'designing', label: 'Design', icon: '🎨', description: 'Creating visual assets' },
  { key: 'completed', label: 'Complete', icon: '✅', description: 'Your carousel is ready!' },
];

interface Props {
  status: GenerationStatus;
  progress: number;
  currentStage: string;
}

export default function StageProgress({ status, progress, currentStage }: Props) {
  const activeIndex = STAGES.findIndex((s) => s.key === status);
  const isError = status === 'error';

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Stage Steps */}
      <div className="flex items-start justify-between mb-8 relative">
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-700 z-0" />
        {STAGES.map((stage, i) => {
          const isDone = !isError && (activeIndex > i || status === 'completed');
          const isActive = !isError && activeIndex === i;
          return (
            <div key={stage.key} className="flex flex-col items-center gap-2 z-10 w-1/4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold transition-all ${
                  isError
                    ? 'bg-slate-700 text-slate-500'
                    : isDone
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40'
                      : isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-500'
                }`}
              >
                {isDone ? '✓' : stage.icon}
              </div>
              <div className="text-center">
                <p
                  className={`text-xs font-semibold ${
                    isActive ? 'text-indigo-400' : isDone ? 'text-indigo-300' : 'text-slate-500'
                  }`}
                >
                  {stage.label}
                </p>
                <p className="text-xs text-slate-600 hidden sm:block">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-800 rounded-full h-3 mb-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isError ? 'bg-red-600' : 'bg-gradient-to-r from-indigo-600 to-violet-600'
          }`}
          style={{ width: `${isError ? 100 : progress}%` }}
        />
      </div>

      {/* Status message */}
      <div className={`text-center text-sm font-medium ${isError ? 'text-red-400' : 'text-slate-300'}`}>
        {isError ? '❌ ' : status === 'completed' ? '🎉 ' : '⏳ '}
        {currentStage}
      </div>
    </div>
  );
}
