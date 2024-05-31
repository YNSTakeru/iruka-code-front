import { ConvexClientProvider } from '@/components/providers/convex-provider';
import { ModalProvider } from '@/components/providers/modal-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Iruka Code',
  description: 'コードの海をイルカのように回遊しよう',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/log.svg',
        href: '/logo.svg',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/log-dark.svg',
        href: '/logo-dark.svg',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="iruka-code-theme-2"
          >
            <Toaster position-="bottom-center" />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
