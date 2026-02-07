import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "FastPDF - Free PDF Tools Online | Merge, Split, Compress PDF",
  description: "Free online PDF tools. Merge PDFs, split PDF, compress PDF, convert JPG to PDF. Fast, secure, no registration required. Process PDFs in your browser.",
  keywords: "merge pdf, split pdf, compress pdf, pdf tools, combine pdf, pdf merger, free pdf tools",
};

// Inline script to prevent theme flash - runs before React hydration
const themeScript = `
  (function() {
    function getTheme() {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) return savedTheme
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    const theme = getTheme()
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased theme-transition">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
