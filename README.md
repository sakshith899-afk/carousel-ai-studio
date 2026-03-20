# Carousel AI Studio

AI-powered Instagram Carousel Generator — Research, Copywriting, and Image Generation in one tool.

## Features

- 🔍 **Research Stage** — Gathers fresh trends, statistics, and insights (Perplexity API or demo mode)
- ✍️ **Copywriting Stage** — Generates 7-slide narrative arc (Hook → Insights → Takeaway → CTA) using GPT-4 or smart templates
- 🎨 **Design Stage** — Creates branded visuals per slide (DALL-E 3 or placeholder images)
- 📱 **Carousel Editor** — Edit all 7 slides inline with live preview
- 📋 **Caption & Hashtags** — Auto-generated Instagram-ready caption and hashtag set
- 📦 **Export** — Download full bundle (ZIP), JSON data, or individual slide images
- 🟢 **Demo Mode** — Works fully without any API keys

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/sakshith899-afk/carousel-ai-studio.git
cd carousel-ai-studio
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local — all fields are optional for demo mode
```

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Optional | GPT-4o-mini copy + DALL-E 3 images |
| `PERPLEXITY_API_KEY` | Optional | Real-time web research |
| `NEXTAUTH_SECRET` | Optional | Auth (not needed for MVP) |
| `SUPABASE_URL` | Optional | Cloud persistence |
| `SUPABASE_ANON_KEY` | Optional | Cloud persistence |

**Without any keys:** The app runs in demo mode with realistic synthetic data.

## Architecture

```
src/
  app/
    page.tsx                  # Homepage with brief form
    generate/[id]/page.tsx    # Carousel editor + preview
    api/
      generate/route.ts       # POST — start generation
      generate/[id]/route.ts  # GET  — poll status
      generate/[id]/slide/[index]/route.ts  # PATCH — update slide
      generate/[id]/export/route.ts         # GET   — export bundle
  components/
    BriefForm.tsx             # Multi-step input form
    StageProgress.tsx         # Pipeline progress UI
    SlideCard.tsx             # Slide preview + inline editor
    SourcesPanel.tsx          # Research transparency panel
    ExportPanel.tsx           # Export options
  lib/
    db.ts                     # File-based JSON persistence
    research.ts               # Research module (Perplexity + fallback)
    copywriting.ts            # Copy generation (OpenAI + fallback)
    imageGen.ts               # Image generation (DALL-E + placeholder)
    pipeline.ts               # Full pipeline orchestration
    utils.ts                  # Shared utilities
  types/
    index.ts                  # TypeScript interfaces
data/                         # Generated runs (gitignored)
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/generate` | Start a new carousel generation |
| `GET` | `/api/generate/:id` | Poll generation status and results |
| `PATCH` | `/api/generate/:id/slide/:index` | Update a specific slide |
| `GET` | `/api/generate/:id/export` | Download JSON bundle |

## Pipeline Stages

1. **Research** (10–40%) — Fetches trends, stats, sources for the topic
2. **Copywriting** (45–70%) — Generates 7 slides with narrative arc
3. **Design** (75–100%) — Assigns visuals to each slide

## Slide Narrative Arc

| Slide | Role | Purpose |
|---|---|---|
| 1 | Hook | Grab attention immediately |
| 2 | Context | Set up the problem/opportunity |
| 3 | Insight 1 | Key data point or trend |
| 4 | Insight 2 | Expert perspective |
| 5 | Insight 3 | Opportunity or risk |
| 6 | Takeaway | Actionable advice |
| 7 | CTA | Call to action / end card |

## Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint check
```

## Limitations (MVP)

- File-based persistence (data/ dir) — not suitable for multi-user production
- Image generation costs per DALL-E 3 call (~$0.04/image, 7 images = ~$0.28/carousel)
- Research in demo mode uses synthetic data (no real-time web access without Perplexity key)
- No authentication/multi-user support in current MVP

## License

MIT
