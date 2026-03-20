import './globals.css';

export const metadata = {
  title: 'Carousel AI Studio',
  description: 'AI-powered carousel generation tool',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-black text-white">
      <body>{children}</body>
    </html>
  );
}