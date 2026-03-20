import { NextRequest, NextResponse } from 'next/server';
import { getRun, updateRun } from '@/lib/db';
import type { Slide } from '@/types';

/**
 * PATCH /api/generate/[id]/slide/[index]
 * Body: Partial<Slide>
 * Returns: updated GenerationRun
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; index: string }> },
) {
  const { id, index } = await params;
  const run = getRun(id);
  if (!run) return NextResponse.json({ error: 'Run not found' }, { status: 404 });
  if (!run.copy) return NextResponse.json({ error: 'No copy generated yet' }, { status: 400 });

  const idx = parseInt(index, 10);
  if (isNaN(idx) || idx < 0 || idx > 6) {
    return NextResponse.json({ error: 'Invalid slide index' }, { status: 400 });
  }

  const updates = (await req.json()) as Partial<Slide>;
  const slides = [...run.copy.slides];
  slides[idx] = { ...slides[idx], ...updates };

  const updated = updateRun(id, {
    copy: { ...run.copy, slides },
  });

  return NextResponse.json(updated);
}
