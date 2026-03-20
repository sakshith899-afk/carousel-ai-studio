'use client';

import BriefForm from '@/components/BriefForm';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-800/50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shadow-indigo-500/25">
                ✦
              </div>
              <span className="font-bold text-xl text-white">Carousel AI Studio</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Demo mode — no API keys needed
            </div>
          </div>
        </header>

        {/* Hero */}
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300 bg-indigo-950/50 border border-indigo-800/50 px-4 py-2 rounded-full mb-6">
            <span>🚀</span>
            <span>AI-Powered Research → Copywriting → Visual Design</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Create stunning
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
              Instagram carousels
            </span>
            <br />
            in minutes
          </h1>

          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Enter a topic, customize your brand — our AI researches trends, writes compelling copy, and designs 7
            stunning slides automatically.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-16">
            {[
              { icon: '🔍', stat: '3 Stages', desc: 'Research → Copy → Design' },
              { icon: '🎨', stat: '7 Slides', desc: 'Narrative arc built in' },
              { icon: '⚡', stat: 'Demo Mode', desc: 'Works without API keys' },
            ].map((item) => (
              <div key={item.stat} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="font-bold text-white text-sm">{item.stat}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-2xl mx-auto px-6 pb-16">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2">Create Your Carousel</h2>
            <p className="text-slate-400 text-sm mb-8">Fill in the details below to generate your 7-slide carousel.</p>
            <BriefForm />
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-4xl mx-auto px-6 pb-24">
          <h2 className="text-2xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: '🔍',
                title: 'Research',
                desc: 'AI scans the web for fresh trends, statistics, and insights about your topic — sourced and timestamped.',
                color: 'from-indigo-600/20 to-indigo-600/0',
                border: 'border-indigo-800/50',
              },
              {
                step: '02',
                icon: '✍️',
                title: 'Copywriting',
                desc: 'Generates 7 slides with a proven narrative arc: Hook → Insights → Takeaway → CTA, with a caption & hashtags.',
                color: 'from-violet-600/20 to-violet-600/0',
                border: 'border-violet-800/50',
              },
              {
                step: '03',
                icon: '🎨',
                title: 'Design',
                desc: 'Applies your brand colors, creates branded visuals for each slide, and formats everything for Instagram.',
                color: 'from-pink-600/20 to-pink-600/0',
                border: 'border-pink-800/50',
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`bg-gradient-to-b ${item.color} border ${item.border} rounded-2xl p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-5xl font-black text-white/5">{item.step}</span>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
