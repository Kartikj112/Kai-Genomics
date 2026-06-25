import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Mono, Syne } from 'next/font/google'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { CustomCursor } from '@/components/ui/CustomCursor'
import '@/app/globals.css'

// ── Font Definitions ─────────────────────────────────────────────────────────
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

// ── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'Kai Labs — A Scientific Ecosystem',
    template: '%s',
  },
  description:
    'A scientific ecosystem for computational biology, genomics, AI, and community-driven learning. Home of Kai Genomics and Kai Exchange.',
  keywords: [
    'computational biology', 'bioinformatics', 'genomics', 'metagenomics',
    'scientific community', 'workshops', 'AI', 'antimicrobial peptides',
    'natural product discovery', 'Kai Labs', 'Kai Genomics', 'Kai Exchange',
  ],
  authors: [{ name: 'Kartik Juyal' }],
  openGraph: {
    title: 'Kai Labs — A Scientific Ecosystem',
    description: 'Computational biology, genomics, AI, and community-driven learning. Research. Learn. Build.',
    type: 'website',
  },
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      // Default to dark — the inline script below overrides before paint
      data-theme="dark"
      className={`${cormorant.variable} ${dmMono.variable} ${syne.variable}`}
    >
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RSLMRHVZN1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-RSLMRHVZN1');
            `,
          }}
        />
        {/*
          Inline theme script: runs synchronously before first paint to avoid
          flash of wrong theme. Must be a plain <script>, not deferred.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('kai-theme');
                  var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
                  var theme = saved || (prefersLight ? 'light' : 'dark');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
