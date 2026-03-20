import type { Slide, UserBrief } from '@/types';

function getPlaceholderUrl(slide: Slide, brief: UserBrief): string {
  const color = (slide.backgroundColor || brief.palette.primary).replace('#', '');
  const textColor = brief.palette.text.replace('#', '');
  // Use picsum with a deterministic seed based on slide index + topic
  const seed = encodeURIComponent(`${brief.topic}-${slide.index}`);
  return `https://picsum.photos/seed/${seed}/1080/1080`;
}

async function generateDallEImage(prompt: string, apiKey: string): Promise<string | null> {
  try {
    const { default: OpenAI } = await import('openai');
    const client = new OpenAI({ apiKey });

    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt: `${prompt}. High quality, Instagram-ready, no text overlay, professional design.`,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    return response.data?.[0]?.url || null;
  } catch {
    return null;
  }
}

export async function generateImages(slides: Slide[], brief: UserBrief): Promise<Slide[]> {
  if (!brief.generateImages) return slides;

  const apiKey = process.env.OPENAI_API_KEY;
  const hasKey = apiKey && apiKey !== 'your_openai_api_key';

  const updatedSlides = await Promise.all(
    slides.map(async (slide) => {
      if (hasKey && slide.imagePrompt) {
        const url = await generateDallEImage(slide.imagePrompt, apiKey!);
        if (url) return { ...slide, imageUrl: url };
      }
      return { ...slide, imageUrl: getPlaceholderUrl(slide, brief) };
    }),
  );

  return updatedSlides;
}
