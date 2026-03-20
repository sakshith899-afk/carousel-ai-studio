'use client';

import type { ResearchOutput } from '@/types';

interface Props {
  research: ResearchOutput;
}

export default function SourcesPanel({ research }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Key Insights
        </h3>
        <ul className="space-y-2">
          {research.keyInsights.map((insight, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-300">
              <span className="text-indigo-400 font-bold flex-shrink-0">{i + 1}.</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span>📊</span> Statistics
        </h3>
        <div className="space-y-2">
          {research.facts.map((fact, i) => (
            <div key={i} className="bg-slate-800 rounded-lg p-3">
              <p className="text-sm text-white font-medium">{fact.stat}</p>
              <p className="text-xs text-slate-400 mt-0.5">Source: {fact.source}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span>🔗</span> Sources
        </h3>
        <div className="space-y-3">
          {research.sources.map((source, i) => (
            <div key={i} className="bg-slate-800 rounded-lg p-3 group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {source.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{source.snippet}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-500">{source.date}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        source.credibility === 'high'
                          ? 'bg-green-900/50 text-green-400'
                          : source.credibility === 'medium'
                            ? 'bg-yellow-900/50 text-yellow-400'
                            : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {source.credibility} credibility
                    </span>
                  </div>
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 text-xs flex-shrink-0"
                >
                  ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-3">Summary</h3>
        <p className="text-sm text-slate-300 leading-relaxed bg-slate-800 rounded-lg p-4">{research.summary}</p>
      </div>
    </div>
  );
}
