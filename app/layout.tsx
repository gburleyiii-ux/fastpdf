import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FastPDF - Free PDF Tools Online | Merge, Split, Compress PDF",
  description: "Free online PDF tools. Merge PDFs, split PDF, compress PDF, convert JPG to PDF. Fast, secure, no registration required. Process PDFs in your browser.",
  keywords: "merge pdf, split pdf, compress pdf, pdf tools, combine pdf, pdf merger, free pdf tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
