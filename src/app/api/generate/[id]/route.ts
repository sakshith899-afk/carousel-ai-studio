import { NextRequest, NextResponse } from 'next/server';
import { getRun } from '@/lib/db';

/**
 * GET /api/generate/[id]
 * Returns: GenerationRun
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const run = getRun(params.id);
  if (!run) {
    return NextResponse.json({ error: 'Run not found' }, { status: 404 });
  }
  return NextResponse.json(run);
}
