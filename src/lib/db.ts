import fs from 'fs';
import path from 'path';
import type { GenerationRun } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getRunPath(id: string): string {
  return path.join(DATA_DIR, `${id}.json`);
}

export function saveRun(run: GenerationRun): void {
  ensureDataDir();
  fs.writeFileSync(getRunPath(run.id), JSON.stringify(run, null, 2), 'utf-8');
}

export function getRun(id: string): GenerationRun | null {
  const filePath = getRunPath(id);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as GenerationRun;
  } catch {
    return null;
  }
}

export function listRuns(): GenerationRun[] {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
  return files
    .map((f) => {
      try {
        const raw = fs.readFileSync(path.join(DATA_DIR, f), 'utf-8');
        return JSON.parse(raw) as GenerationRun;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as GenerationRun[];
}

export function updateRun(id: string, updates: Partial<GenerationRun>): GenerationRun | null {
  const run = getRun(id);
  if (!run) return null;
  const updated: GenerationRun = { ...run, ...updates, updatedAt: new Date().toISOString() };
  saveRun(updated);
  return updated;
}
