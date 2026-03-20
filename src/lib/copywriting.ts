import type { UserBrief, ResearchOutput, CopyOutput, Slide, SlideRole } from '@/types';

const SLIDE_ROLES: SlideRole[] = ['hook', 'context', 'insight1', 'insight2', 'insight3', 'takeaway', 'cta'];

function buildDemoCopy(brief: UserBrief, research: ResearchOutput): CopyOutput {
  const { topic, brandName, tone, ctaGoal } = brief;
  const brand = brandName || 'Us';
  const insight0 = research.keyInsights[0] || `${topic} is transforming industries.`;
  const insight1 = research.keyInsights[1] || `Adoption is accelerating rapidly.`;
  const insight2 = research.keyInsights[2] || `Productivity gains are measurable.`;
  const fact0 = research.facts[0]?.stat || `${topic} market growing 40% YoY`;
  const fact1 = research.facts[1]?.stat || `73% of leaders prioritize ${topic}`;

  const toneMap: Record<string, string> = {
    professional: 'concise and authoritative',
    playful: 'fun and engaging',
    bold: 'powerful and direct',
    educational: 'informative and clear',
    inspirational: 'motivating and uplifting',
  };
  const toneLabel = toneMap[tone] || 'engaging';

  const slides: Slide[] = [
    {
      index: 0,
      role: 'hook',
      title: `🚀 ${topic} Is Changing Everything`,
      body: `And if you're not paying attention, you're already falling behind. Here's what the data says...`,
      imagePrompt: `Dynamic, ${brief.imageStyle} visual representing ${topic} transformation, ${toneLabel} energy, brand colors ${brief.palette.primary}`,
      backgroundColor: brief.palette.primary,
    },
    {
      index: 1,
      role: 'context',
      title: `The Problem Everyone Ignores`,
      body: `Most people know about ${topic}. But very few understand its real-world implications for ${brief.audience || 'everyday life'}.`,
      imagePrompt: `Thought-provoking ${brief.imageStyle} illustration showing challenge or problem related to ${topic}`,
      backgroundColor: brief.palette.secondary,
    },
    {
      index: 2,
      role: 'insight1',
      title: `📊 The Numbers Don't Lie`,
      body: `${fact0}. This isn't a trend — it's a fundamental shift.`,
      imagePrompt: `Clean data visualization or infographic style showing statistics for ${topic}, ${brief.imageStyle} aesthetic`,
      backgroundColor: brief.palette.primary,
    },
    {
      index: 3,
      role: 'insight2',
      title: `What the Experts Are Saying`,
      body: `${insight1.slice(0, 120)}${insight1.length > 120 ? '...' : ''}`,
      imagePrompt: `Professional ${brief.imageStyle} image representing expertise and insight in ${topic}`,
      backgroundColor: brief.palette.accent,
    },
    {
      index: 4,
      role: 'insight3',
      title: `The Opportunity You're Missing`,
      body: `${insight2.slice(0, 120)}${insight2.length > 120 ? '...' : ''}`,
      imagePrompt: `Optimistic ${brief.imageStyle} visual showing opportunity and growth related to ${topic}`,
      backgroundColor: brief.palette.secondary,
    },
    {
      index: 5,
      role: 'takeaway',
      title: `Your Action Plan`,
      body: `1. Learn the fundamentals\n2. Start small, scale fast\n3. Measure your impact\n\n${insight0.slice(0, 80)}...`,
      imagePrompt: `Action-oriented ${brief.imageStyle} visual showing steps or roadmap for ${topic} adoption`,
      backgroundColor: brief.palette.primary,
    },
    {
      index: 6,
      role: 'cta',
      title: `Ready to Get Started? 🎯`,
      body: `${ctaGoal || `Follow ${brand} for more insights on ${topic}`}.\n\nSave this post and share it with someone who needs to see this.`,
      imagePrompt: `Branded ${brief.imageStyle} call-to-action slide for ${brand}, featuring ${topic}, motivational`,
      backgroundColor: brief.palette.accent,
    },
  ];

  const hashtags = [
    `#${topic.replace(/\s+/g, '')}`,
    `#${topic.split(' ')[0]}`,
    `#InstagramCarousel`,
    `#${brand.replace(/\s+/g, '')}`,
    `#Trending`,
    `#Innovation`,
    `#FutureOfWork`,
    `#Tech`,
    `#Growth`,
    `#LearnOnInstagram`,
  ];

  const caption = `🔥 Everything you need to know about ${topic} — in 7 slides.

${research.summary.slice(0, 200)}...

${ctaGoal || `Follow us for more content like this`} 👇

${hashtags.slice(0, 6).join(' ')}`;

  const altTexts = slides.map((s) => `Slide ${s.index + 1}: ${s.title}`);

  return {
    slides,
    caption,
    hashtags,
    altTexts,
    generatedAt: new Date().toISOString(),
  };
}

async function generateWithOpenAI(brief: UserBrief, research: ResearchOutput): Promise<CopyOutput> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key') {
    return buildDemoCopy(brief, research);
  }

  try {
    const { default: OpenAI } = await import('openai');
    const client = new OpenAI({ apiKey });

    const prompt = `You are an expert Instagram content strategist. Create a 7-slide carousel about "${brief.topic}" for ${brief.audience || 'a general audience'}.

Brand: ${brief.brandName || 'Generic Brand'}
Tone: ${brief.tone}
CTA Goal: ${brief.ctaGoal || 'Grow followers'}

Research insights:
${research.keyInsights.slice(0, 5).join('\n')}

Key stats:
${research.facts
  .slice(0, 3)
  .map((f) => `- ${f.stat} (${f.source})`)
  .join('\n')}

Create exactly 7 slides with these roles: hook, context, insight1, insight2, insight3, takeaway, cta.

Respond with JSON only:
{
  "slides": [
    {"index": 0, "role": "hook", "title": "...", "body": "...", "imagePrompt": "..."},
    ...
  ],
  "caption": "...",
  "hashtags": ["#tag1", ...]
}

Keep titles under 60 chars, body under 150 chars. Image prompts should describe a high-quality ${brief.imageStyle} image.`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return buildDemoCopy(brief, research);

    const parsed = JSON.parse(content);
    const demo = buildDemoCopy(brief, research);

    const slides: Slide[] = (parsed.slides || []).map((s: Partial<Slide>, i: number) => ({
      index: i,
      role: s.role || SLIDE_ROLES[i],
      title: s.title || demo.slides[i].title,
      body: s.body || demo.slides[i].body,
      imagePrompt: s.imagePrompt || demo.slides[i].imagePrompt,
      backgroundColor: demo.slides[i].backgroundColor,
    }));

    return {
      slides: slides.length === 7 ? slides : demo.slides,
      caption: parsed.caption || demo.caption,
      hashtags: parsed.hashtags || demo.hashtags,
      altTexts: slides.map((s: Slide) => `Slide ${s.index + 1}: ${s.title}`),
      generatedAt: new Date().toISOString(),
    };
  } catch {
    return buildDemoCopy(brief, research);
  }
}

export async function runCopywriting(brief: UserBrief, research: ResearchOutput): Promise<CopyOutput> {
  return generateWithOpenAI(brief, research);
}
