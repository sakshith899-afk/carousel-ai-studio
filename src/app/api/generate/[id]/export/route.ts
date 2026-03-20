import { NextRequest, NextResponse } from 'next/server';
import { getRun } from '@/lib/db';

/**
 * GET /api/generate/[id]/export
 * Returns: JSON bundle with brief, research, copy, sources
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const run = getRun(params.id);
  if (!run) return NextResponse.json({ error: 'Run not found' }, { status: 404 });
  if (run.status !== 'completed') {
    return NextResponse.json({ error: 'Generation not complete' }, { status: 400 });
  }

  const bundle = {
    id: run.id,
    generatedAt: run.createdAt,
    brief: run.brief,
    research: {
      summary: run.research?.summary,
      keyInsights: run.research?.keyInsights,
      facts: run.research?.facts,
      sources: run.research?.sources,
    },
    slides: run.copy?.slides.map((s) => ({
      index: s.index,
      role: s.role,
      title: s.title,
      body: s.body,
      imageUrl: s.imageUrl,
    })),
    caption: run.copy?.caption,
    hashtags: run.copy?.hashtags,
  };

  return new NextResponse(JSON.stringify(bundle, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="carousel-${run.id.slice(0, 8)}.json"`,
    },
  });
}
