import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ポモドーロタイマー',
  description: '集中力を高める25分間の作業セッション',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}