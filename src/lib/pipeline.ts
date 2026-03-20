import { v4 as uuidv4 } from 'uuid';
import type { UserBrief, GenerationRun } from '@/types';
import { saveRun, updateRun } from './db';
import { runResearch } from './research';
import { runCopywriting } from './copywriting';
import { generateImages } from './imageGen';

export function createRun(brief: UserBrief): GenerationRun {
  const run: GenerationRun = {
    id: uuidv4(),
    brief,
    status: 'pending',
    progress: 0,
    currentStage: 'Initializing...',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveRun(run);
  return run;
}

export async function runPipeline(runId: string): Promise<void> {
  try {
    // Stage 1: Research
    updateRun(runId, { status: 'researching', progress: 10, currentStage: 'Researching topic...' });
    const run = (await import('./db')).getRun(runId);
    if (!run) throw new Error('Run not found');

    const research = await runResearch(run.brief);
    updateRun(runId, { research, progress: 40, currentStage: 'Research complete. Writing copy...' });

    // Stage 2: Copywriting
    updateRun(runId, { status: 'writing', progress: 45, currentStage: 'Writing 7-slide copy...' });
    const copy = await runCopywriting(run.brief, research);
    updateRun(runId, { copy, progress: 70, currentStage: 'Copy written. Generating visuals...' });

    // Stage 3: Image generation
    updateRun(runId, { status: 'designing', progress: 75, currentStage: 'Creating slide visuals...' });
    const slidesWithImages = await generateImages(copy.slides, run.brief);
    const updatedCopy = { ...copy, slides: slidesWithImages };

    updateRun(runId, {
      copy: updatedCopy,
      status: 'completed',
      progress: 100,
      currentStage: 'Done! Your carousel is ready.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    updateRun(runId, {
      status: 'error',
      progress: 0,
      currentStage: 'Error',
      error: message,
    });
  }
}
