"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Download, X, Zap, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useUser } from "@/hooks/useUser";
import { useUsage } from "@/hooks/useUsage";
import AuthModal from "@/components/AuthModal";
import DarkModeToggle from "@/components/DarkModeToggle";

type HAlign = 'left' | 'center' | 'right';
type VAlign = 'top' | 'bottom';
type Format = 'number' | 'page-of-total' | 'dash-number-dash';

export default function PageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  const [hAlign, setHAlign] = useState<HAlign>('center');
  const [vAlign, setVAlign] = useState<VAlign>('bottom');
  const [format, setFormat] = useState<Format>('page-of-total');
  const [adding, setAdding] = useState(false);
  const [resultPdf, setResultPdf] = useState<Uint8Array | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, signOut } = useUser();
  const { canUse, logUsage, remainingUses, isPro, loading: usageLoading } = useUsage('page_numbers');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setResultPdf(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
  });

  const addPageNumbers = async () => {
    if (!file) return;
    if (!user) { setShowAuthModal(true); return; }
    if (!canUse && !isPro) {
      alert('Free limit reached! Upgrade to Pro for unlimited use.');
      return;
    }

    setAdding(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const total = pages.length;
      const margin = 30;

      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const pageNum = i + startNumber;
        let label: string;
        switch (format) {
          case 'number':           label = `${pageNum}`; break;
          case 'dash-number-dash': label = `- ${pageNum} -`; break;
          default:                 label = `Page ${pageNum} of ${pageNum + total - i - 1 + startNumber - 1}`; break;
        }
        // Re-compute total correctly
        if (format === 'page-of-total') {
          label = `Page ${pageNum} of ${total + startNumber - 1}`;
        }

        const textWidth = font.widthOfTextAtSize(label, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        let x: number;
        switch (hAlign) {
          case 'left':  x = margin; break;
          case 'right': x = width - textWidth - margin; break;
          default:      x = (width - textWidth) / 2;
        }
        const y = vAlign === 'top' ? height - margin - textHeight : margin;

        page.drawText(label, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      });

      const pdfBytes = await pdf.save();
      setResultPdf(pdfBytes);
      await logUsage();
    } catch (error) {
      console.error('Page numbers error:', error);
      alert('Failed to add page numbers. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const download = () => {
    if (!resultPdf) return;
    const blob = new Blob([resultPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file ? `${file.name.replace('.pdf', '')}_numbered.pdf` : 'numbered.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => { setFile(null); setResultPdf(null); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 theme-transition">
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 theme-transition">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <span className="text-2xl font-black text-gray-900 dark:text-white">FastPDF</span>
          </Link>
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white font-medium">Dashboard</Link>
                {!isPro && (
                  <Link href="/pricing" className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform">
                    Upgrade to Pro
                  </Link>
                )}
                <button onClick={signOut} className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white text-sm">Sign Out</button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform">
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <span className="text-sm">🔢</span>
            Page Numbers
          </div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">Add Page Numbers</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300">Stamp page numbers on every page of your PDF.</p>
        </div>

        {/* Banners */}
        {user && !isPro && !usageLoading && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 mb-8 flex items-center justify-between theme-transition">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-gray-900 dark:text-white">{remainingUses} free {remainingUses === 1 ? 'use' : 'uses'} remaining today</span>
            </div>
            <Link href="/pricing" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-sm">Get Unlimited →</Link>
          </div>
        )}
        {user && isPro && (
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl p-4 mb-8 flex items-center gap-3">
            <Zap className="w-6 h-6" /><span className="font-bold">Pro Plan • Unlimited Use</span>
          </div>
        )}
        {!user && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-8 flex items-center justify-between theme-transition">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <span className="font-bold text-gray-900 dark:text-white">Sign in to add page numbers</span>
            </div>
            <button onClick={() => setShowAuthModal(true)} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-sm">Sign In →</button>
          </div>
        )}

        {!resultPdf ? (
          <div className="space-y-6">
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🔢</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{isDragActive ? 'Drop PDF here' : 'Click or drag PDF here'}</h3>
                <p className="text-gray-600 dark:text-slate-400">Choose the PDF to number</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6 flex items-center justify-between theme-transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{file.name}</h3>
                    <p className="text-gray-600 dark:text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
                <button onClick={reset} className="text-gray-400 hover:text-red-600 transition-colors"><X className="w-6 h-6" /></button>
              </div>
            )}

            {file && (
              <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6 space-y-5 theme-transition">
                <h3 className="font-bold text-gray-900 dark:text-white">Number Settings</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Format</label>
                    <select
                      value={format}
                      onChange={e => setFormat(e.target.value as Format)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-xl dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    >
                      <option value="page-of-total">Page 1 of 10</option>
                      <option value="number">1</option>
                      <option value="dash-number-dash">- 1 -</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Start at</label>
                    <input
                      type="number" min="1" max="9999" value={startNumber}
                      onChange={e => setStartNumber(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-xl dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Horizontal</label>
                    <select
                      value={hAlign}
                      onChange={e => setHAlign(e.target.value as HAlign)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-xl dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Vertical</label>
                    <select
                      value={vAlign}
                      onChange={e => setVAlign(e.target.value as VAlign)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-xl dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    >
                      <option value="bottom">Bottom</option>
                      <option value="top">Top</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Font Size: {fontSize}pt</label>
                  <input
                    type="range" min="8" max="24" value={fontSize}
                    onChange={e => setFontSize(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <button
                  onClick={addPageNumbers}
                  disabled={adding || (!!user && !canUse && !isPro) || usageLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
                >
                  {adding ? 'Adding numbers...' : !user ? 'Sign In to Continue →' : user && !canUse && !isPro ? 'Upgrade to Continue →' : 'Add Page Numbers →'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-12 text-center theme-transition">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Page Numbers Added!</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8">Your PDF now has page numbers on every page.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={download}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
              >
                <Download className="w-5 h-5" />
                Download Numbered PDF
              </button>
              <button onClick={reset} className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                Number Another
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 flex items-start gap-4 theme-transition">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Your files are 100% private</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">All processing happens in your browser. Your files never leave your device.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
