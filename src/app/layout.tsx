import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Carousel AI Studio — Instagram Carousel Generator',
  description: 'AI-powered Instagram carousel generation: research, copywriting, and visual design in one tool.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}