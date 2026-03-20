import { NextRequest, NextResponse } from 'next/server';
import { getRun } from '@/lib/db';

/**
 * GET /api/generate/[id]
 * Returns: GenerationRun
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const run = getRun(id);
  if (!run) {
    return NextResponse.json({ error: 'Run not found' }, { status: 404 });
  }
  return NextResponse.json(run);
}
