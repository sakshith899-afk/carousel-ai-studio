import { NextRequest, NextResponse } from 'next/server';
import type { UserBrief } from '@/types';
import { createRun, runPipeline } from '@/lib/pipeline';

/**
 * POST /api/generate
 * Body: UserBrief
 * Returns: { id: string }
 */
export async function POST(req: NextRequest) {
  try {
    const brief = (await req.json()) as UserBrief;

    if (!brief.topic || brief.topic.trim() === '') {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const run = createRun(brief);

    // Run the pipeline asynchronously (fire and forget)
    runPipeline(run.id).catch((err) => {
      console.error('Pipeline error for run', run.id, err);
    });

    return NextResponse.json({ id: run.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/generate error:', err);
    return NextResponse.json({ error: 'Failed to start generation' }, { status: 500 });
  }
}
